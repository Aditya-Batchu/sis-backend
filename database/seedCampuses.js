require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Campus = require('../models/Campus');

const campusesSeedData = [
  {
    name: 'IIIT Nuzvid',
    code: 'NUZ',
    campusNumber: '01',
    region: 'AU',
    district: 'Eluru',
    address: 'Mylavaram Road, Nuzvid, Eluru District, Andhra Pradesh - 521202',
    contactEmail: 'director@rguktn.ac.in',
    contactPhone: '+91 8656-235855',
    directorName: 'Prof. P. V. G. D. Prasad Reddy',
    aoEmail: 'ao@rguktn.ac.in',
    deanAcademicsEmail: 'dean.academics@rguktn.ac.in',
    coeEmail: 'exam.cell@rguktn.ac.in',
    establishedYear: 2008,
    annualIntake: 1100,
    currentStrength: 7240,
    landAreaAcres: 280,
    status: 'Active',
    isDeleted: false,
  },
  {
    name: 'IIIT RK Valley (Idupulapaya)',
    code: 'RKV',
    campusNumber: '02',
    region: 'SVU',
    district: 'YSR Kadapa',
    address: 'Idupulapaya, Vempalli Mandal, YSR Kadapa District, Andhra Pradesh - 516330',
    contactEmail: 'director@rguktrkv.ac.in',
    contactPhone: '+91 8588-283687',
    directorName: 'Prof. K. Sandhya Rani',
    aoEmail: 'ao@rguktrkv.ac.in',
    deanAcademicsEmail: 'dean.academics@rguktrkv.ac.in',
    coeEmail: 'exam.cell@rguktrkv.ac.in',
    establishedYear: 2008,
    annualIntake: 1100,
    currentStrength: 7180,
    landAreaAcres: 330,
    status: 'Active',
    isDeleted: false,
  },
  {
    name: 'IIIT Ongole',
    code: 'ONG',
    campusNumber: '03',
    region: 'AU',
    district: 'Prakasam',
    address: 'Santhanuthalapadu, Ongole, Prakasam District, Andhra Pradesh - 523225',
    contactEmail: 'director@rguktong.ac.in',
    contactPhone: '+91 8592-232115',
    directorName: 'Prof. B. Jayarami Reddy',
    aoEmail: 'ao@rguktong.ac.in',
    deanAcademicsEmail: 'dean.academics@rguktong.ac.in',
    coeEmail: 'exam.cell@rguktong.ac.in',
    establishedYear: 2016,
    annualIntake: 1100,
    currentStrength: 7260,
    landAreaAcres: 85,
    status: 'Active',
    isDeleted: false,
  },
  {
    name: 'IIIT Srikakulam',
    code: 'SKL',
    campusNumber: '04',
    region: 'AU',
    district: 'Srikakulam',
    address: 'Etcherla Campus, S.M. Puram, Srikakulam District, Andhra Pradesh - 532410',
    contactEmail: 'director@rguktskl.ac.in',
    contactPhone: '+91 8942-240120',
    directorName: 'Prof. P. Jagadeeswara Rao',
    aoEmail: 'ao@rguktsklm.ac.in',
    deanAcademicsEmail: 'dean.academics@rguktsklm.ac.in',
    coeEmail: 'exam.cell@rguktsklm.ac.in',
    establishedYear: 2016,
    annualIntake: 1100,
    currentStrength: 7260,
    landAreaAcres: 120,
    status: 'Active',
    isDeleted: false,
  },
];

const seedCampuses = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rgukt_sis';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    for (const campusData of campusesSeedData) {
      await Campus.findOneAndUpdate(
        { code: campusData.code },
        { ...campusData, isDeleted: false, deletedAt: null },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`[Seed] Successfully seeded ${campusesSeedData.length} RGUKT constituent campuses.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error seeding campuses: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedCampuses();
}

module.exports = { campusesSeedData, seedCampuses };
