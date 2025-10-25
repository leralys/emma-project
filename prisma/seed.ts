import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in reverse order of dependencies)
  try {
    await prisma.messageReadReceipt.deleteMany();
    await prisma.message.deleteMany();
    await prisma.threadParticipant.deleteMany();
    await prisma.thread.deleteMany();
    await prisma.device.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleared existing data');
  } catch (error) {
    console.log('📝 Database is empty, skipping cleanup');
  }

  // Create admin user with password
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.create({
    data: {
      id: 'admin-user-id',
      name: 'Admin User',
      passwordHash: adminPassword,
      roles: {
        create: [{ role: Role.admin }],
      },
    },
  });

  console.log('✅ Created admin user:', { id: admin.id, name: admin.name });

  // Create regular users (no password - they'll use device keys)
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      roles: {
        create: [{ role: Role.user }],
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      roles: {
        create: [{ role: Role.user }],
      },
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie Davis',
      roles: {
        create: [{ role: Role.user }],
      },
    },
  });

  console.log('✅ Created users:', {
    alice: { id: alice.id, name: alice.name },
    bob: { id: bob.id, name: bob.name },
    charlie: { id: charlie.id, name: charlie.name },
  });

  // Create devices for users
  const aliceDevice = await prisma.device.create({
    data: {
      userId: alice.id,
      keyHash: 'alice-device-key-hash-1',
      timezone: 'America/New_York', // Alice is in New York (EST/EDT)
      pushEndpoint: 'https://push.example.com/alice',
      pushP256dh: 'alice-p256dh-key',
      pushAuth: 'alice-auth-secret',
    },
  });

  const bobDevice = await prisma.device.create({
    data: {
      userId: bob.id,
      keyHash: 'bob-device-key-hash-1',
      timezone: 'Europe/London', // Bob is in London (GMT/BST)
      pushEndpoint: 'https://push.example.com/bob',
      pushP256dh: 'bob-p256dh-key',
      pushAuth: 'bob-auth-secret',
    },
  });

  console.log('✅ Created devices:', {
    aliceDevice: { id: aliceDevice.id },
    bobDevice: { id: bobDevice.id },
  });

  // Create a thread between Alice and Bob
  const thread1 = await prisma.thread.create({
    data: {
      title: 'Alice & Bob Chat',
      participants: {
        create: [{ userId: alice.id }, { userId: bob.id }],
      },
    },
  });

  console.log('✅ Created thread:', { id: thread1.id, title: thread1.title });

  // Create some messages in the thread
  const message1 = await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: alice.id,
      ciphertext: Buffer.from('encrypted-message-1'),
      iv: Buffer.from('iv-1'),
      salt: Buffer.from('salt-1'),
      mediaUrls: [],
      delivered: true,
      deliveredAtUTC: new Date(),
    },
  });

  const message2 = await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: bob.id,
      ciphertext: Buffer.from('encrypted-message-2'),
      iv: Buffer.from('iv-2'),
      salt: Buffer.from('salt-2'),
      mediaUrls: [],
      delivered: true,
      deliveredAtUTC: new Date(),
    },
  });

  console.log('✅ Created messages:', {
    message1: { id: message1.id },
    message2: { id: message2.id },
  });

  // Create read receipts
  await prisma.messageReadReceipt.create({
    data: {
      messageId: message1.id,
      userId: bob.id,
      readAtUTC: new Date(), // Bob read Alice's message
    },
  });

  await prisma.messageReadReceipt.create({
    data: {
      messageId: message2.id,
      userId: alice.id,
      readAtUTC: new Date(), // Alice read Bob's message
    },
  });

  console.log('✅ Created read receipts');

  // Create a group thread with 3 participants
  const groupThread = await prisma.thread.create({
    data: {
      title: 'Team Discussion',
      participants: {
        create: [{ userId: alice.id }, { userId: bob.id }, { userId: charlie.id }],
      },
    },
  });

  console.log('✅ Created group thread:', {
    id: groupThread.id,
    title: groupThread.title,
  });

  // Create a scheduled message (from admin)
  const scheduledMessage = await prisma.message.create({
    data: {
      threadId: groupThread.id,
      senderId: admin.id,
      scheduledAtUTC: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      delivered: false,
      ciphertext: Buffer.from('encrypted-scheduled-message'),
      iv: Buffer.from('scheduled-iv'),
      salt: Buffer.from('scheduled-salt'),
      mediaUrls: ['https://example.com/image.jpg'],
    },
  });

  console.log('✅ Created scheduled message:', {
    id: scheduledMessage.id,
    scheduledAt: scheduledMessage.scheduledAtUTC,
  });

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - Users: 4 (1 admin, 3 regular users)');
  console.log('  - Devices: 2');
  console.log('  - Threads: 2 (1 direct chat, 1 group)');
  console.log('  - Messages: 3 (2 delivered, 1 scheduled)');
  console.log('  - Read receipts: 2');
  console.log('\n🔐 Admin credentials:');
  console.log('  ID: admin-user-id');
  console.log('  Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
