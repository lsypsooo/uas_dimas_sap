const prisma = require("../lib/prisma");

const getAllCuti = async (req, res) => {
  const { perusahaanId, role, karyawan } = req.user;

  try {
    let cutiList;

    if (role === "ADMIN_PERUSAHAAN") {
      // Admin melihat semua cuti di perusahaannya
      cutiList = await prisma.cuti.findMany({
        where: { perusahaanId },
        include: {
          karyawan: {
            select: {
              id: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          tanggalMulai: "desc",
        },
      });
    } else if (role === "KARYAWAN") {
      if (!karyawan) {
        return res
          .status(403)
          .json({ error: "Anda tidak terdaftar sebagai karyawan" });
      }
      cutiList = await prisma.cuti.findMany({
        where: { karyawanId: karyawan.id },
        orderBy: {
          tanggalMulai: "desc",
        },
      });
    }

    res.json(cutiList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCuti = async (req, res) => {
  // Admin/HR yang login, kita hanya butuh perusahaanId-nya
  const { perusahaanId } = req.user;

  // Ambil ID karyawan yang akan dibuatkan cuti dari body request
  const { karyawanId, tanggalMulai, tanggalSelesai, alasan } = req.body;

  // Validasi input
  if (!karyawanId) {
    return res
      .status(400)
      .json({ error: "karyawanId harus disertakan dalam body request." });
  }

  try {
    // Validasi tanggal
    if (new Date(tanggalMulai) >= new Date(tanggalSelesai)) {
      return res
        .status(400)
        .json({ error: "Tanggal selesai harus setelah tanggal mulai" });
    }

    // Cek apakah karyawan ada di perusahaan yang sama (opsional tapi disarankan)
    const karyawanExists = await prisma.karyawan.findFirst({
      where: { id: Number(karyawanId), perusahaanId: perusahaanId },
      select: { id: true, jatahCuti: true, perusahaanId: true },
    });
    if (!karyawanExists) {
      return res
        .status(404)
        .json({ error: "Karyawan tidak ditemukan di perusahaan ini." });
    }

    // Cek kuota cuti
    const currentYear = new Date().getFullYear();
    const approvedCutiThisYear = await prisma.cuti.findMany({
      where: {
        karyawanId: Number(karyawanId),
        status: "APPROVED",
        tanggalMulai: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
    });
    const usedDays = approvedCutiThisYear.reduce((total, c) => {
      const start = new Date(c.tanggalMulai);
      const end = new Date(c.tanggalSelesai);
      return total + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);

    const requestedStart = new Date(tanggalMulai);
    const requestedEnd = new Date(tanggalSelesai);
    const requestedDays =
      Math.ceil((requestedEnd - requestedStart) / (1000 * 60 * 60 * 24)) + 1;

    if (usedDays + requestedDays > karyawanExists.jatahCuti) {
      return res.status(400).json({
        error: `Kuota cuti tidak cukup. Sisa: ${karyawanExists.jatahCuti - usedDays} hari, diminta: ${requestedDays} hari.`,
      });
    }

    // Cek cuti overlapping menggunakan karyawanId dari body
    const existingCuti = await prisma.cuti.findFirst({
      where: {
        karyawanId: Number(karyawanId),
        OR: [
          {
            tanggalMulai: { lte: new Date(tanggalSelesai) },
            tanggalSelesai: { gte: new Date(tanggalMulai) },
          },
        ],
      },
    });

    if (existingCuti) {
      return res.status(400).json({
        error: "Karyawan sudah memiliki jadwal cuti yang bertabrakan.",
      });
    }

    // Buat cuti menggunakan karyawanId dari body
    const cuti = await prisma.cuti.create({
      data: {
        karyawanId: Number(karyawanId),
        perusahaanId,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        alasan,
        status: "PENDING",
      },
      include: {
        karyawan: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(cuti);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateStatusCuti = async (req, res) => {
  const { perusahaanId } = req.user;
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validasi status

    // Cek apakah cuti ada dan milik perusahaan yang sama
    const cuti = await prisma.cuti.findFirst({
      where: {
        id: parseInt(id),
        perusahaanId,
      },
    });

    if (!cuti) {
      return res.status(404).json({ error: "Cuti tidak ditemukan" });
    }

    // Update status cuti
    const updatedCuti = await prisma.cuti.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        karyawan: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedCuti);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCuti = async (req, res) => {
  const { perusahaanId, role, karyawan } = req.user;
  const { id } = req.params;

  try {
    if (role === "KARYAWAN" && !karyawan) {
      return res
        .status(403)
        .json({ error: "Anda tidak terdaftar sebagai karyawan" });
    }

    const cuti = await prisma.cuti.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cuti) {
      return res.status(404).json({ error: "Cuti tidak ditemukan" });
    }

    // Validasi hak akses
    if (role === "ADMIN_PERUSAHAAN") {
      // Admin hanya bisa menghapus cuti di perusahaannya
      if (cuti.perusahaanId !== perusahaanId) {
        return res
          .status(403)
          .json({ error: "Anda tidak berhak menghapus cuti ini" });
      }
    } else if (role === "KARYAWAN") {
      // Karyawan hanya bisa menghapus cuti sendiri yang masih PENDING
      if (cuti.karyawanId !== karyawan.id || cuti.status !== "PENDING") {
        return res.status(403).json({
          error:
            "Anda hanya bisa menghapus cuti sendiri yang berstatus PENDING",
        });
      }
    }

    await prisma.cuti.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Cuti berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeaveBalance = async (req, res) => {
  const { karyawan } = req.user;
  if (!karyawan) {
    return res
      .status(403)
      .json({ error: "Anda tidak terdaftar sebagai karyawan" });
  }
  try {
    const karyawanData = await prisma.karyawan.findUnique({
      where: { id: karyawan.id },
      select: { jatahCuti: true },
    });
    const currentYear = new Date().getFullYear();
    const approvedCuti = await prisma.cuti.findMany({
      where: {
        karyawanId: karyawan.id,
        status: "APPROVED",
        tanggalMulai: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
    });
    const usedDays = approvedCuti.reduce((total, c) => {
      const start = new Date(c.tanggalMulai);
      const end = new Date(c.tanggalSelesai);
      return total + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);
    const pendingCuti = await prisma.cuti.findMany({
      where: {
        karyawanId: karyawan.id,
        status: "PENDING",
        tanggalMulai: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
    });
    const pendingDays = pendingCuti.reduce((total, c) => {
      const start = new Date(c.tanggalMulai);
      const end = new Date(c.tanggalSelesai);
      return total + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);
    res.json({
      jatahCuti: karyawanData.jatahCuti,
      terpakai: usedDays,
      pending: pendingDays,
      sisa: karyawanData.jatahCuti - usedDays,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCuti,
  createCuti,
  updateStatusCuti,
  deleteCuti,
  getLeaveBalance,
};
