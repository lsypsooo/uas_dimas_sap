const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const login = async (req, res) => {
  const { email, password } = req.body; // Ubah dari username ke email

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { perusahaan: true, karyawan: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Email tidak terdaftar" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, perusahaanId: user.perusahaanId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        perusahaan: user.perusahaan,
        karyawan: user.karyawan,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  const { username, email, password, role, perusahaanId } = req.body;

  // Validasi input
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  // Validasi format email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Format email tidak valid" });
  }

  // Validasi strength password

  // Validasi role
  const allowedRoles = ["ADMIN_PERUSAHAAN", "KARYAWAN", "SUPERADMIN"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      error: "Role tidak valid",
      allowedRoles: allowedRoles,
    });
  }

  try {
    // Cek unique username dan email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username sudah digunakan" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email sudah terdaftar" });
      }
    }

    // Buat user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        perusahaanId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Kirim email verifikasi (contoh pseudo-code)
    // sendVerificationEmail(newUser.email);

    res.status(201).json({
      message: "Registrasi berhasil. Silakan verifikasi email Anda.",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat registrasi",
      details: error.message,
    });
  }
};

module.exports = { login, register, changePassword, updateProfile };

// Ganti password
async function changePassword(req, res) {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Password lama dan baru wajib diisi." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password baru minimal 6 karakter." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password lama salah." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    res.json({ message: "Password berhasil diubah." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update profil (username & email)
async function updateProfile(req, res) {
  const userId = req.user.id;
  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json({ error: "Tidak ada data yang diubah." });
  }
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: "Format email tidak valid." });
  }

  try {
    // Cek duplikat
    if (email || username) {
      const conditions = [];
      if (email) conditions.push({ email });
      if (username) conditions.push({ username });
      const existing = await prisma.user.findFirst({
        where: { OR: conditions, NOT: { id: userId } },
      });
      if (existing) {
        if (existing.email === email)
          return res.status(400).json({ error: "Email sudah digunakan." });
        if (existing.username === username)
          return res.status(400).json({ error: "Username sudah digunakan." });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, username: true, email: true, role: true },
    });

    // Re-fetch full user with relations for frontend
    const fullUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { perusahaan: true, karyawan: true },
    });

    res.json({
      message: "Profil berhasil diperbarui.",
      user: {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        role: fullUser.role,
        perusahaan: fullUser.perusahaan,
        karyawan: fullUser.karyawan,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
