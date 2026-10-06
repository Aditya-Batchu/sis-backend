const Campus = require('../models/Campus');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all campuses with search and filtering
 * GET /api/v1/system-setup/campuses
 */
const getCampuses = async (req, res) => {
  try {
    const { search, region, status } = req.query;

    const filter = { isDeleted: false };

    if (region && region !== 'all') {
      filter.region = region;
    }

    if (status && status !== 'all') {
      filter.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { district: searchRegex },
        { contactEmail: searchRegex },
        { directorName: searchRegex },
      ];
    }

    const campuses = await Campus.find(filter).sort({ establishedYear: 1, name: 1 });

    return successResponse(res, 'Campuses fetched successfully', campuses);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get campus summary statistics
 * GET /api/v1/system-setup/campuses/stats
 */
const getCampusStats = async (req, res) => {
  try {
    const activeCampuses = await Campus.find({ isDeleted: false });

    const totalCampuses = activeCampuses.length;
    const auCount = activeCampuses.filter((c) => c.region === 'AU').length;
    const svuCount = activeCampuses.filter((c) => c.region === 'SVU').length;
    const totalEnrolled = activeCampuses.reduce((acc, c) => acc + (c.currentStrength || 0), 0);
    const totalIntake = activeCampuses.reduce((acc, c) => acc + (c.annualIntake || 0), 0);

    return successResponse(res, 'Campus stats computed successfully', {
      totalCampuses,
      auCount,
      svuCount,
      totalEnrolled,
      totalIntake,
      academicDepartments: '7 Engg + Sciences',
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get single campus by ID
 * GET /api/v1/system-setup/campuses/:id
 */
const getCampusById = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({ _id: id, isDeleted: false });

    if (!campus) {
      return errorResponse(res, 'Campus not found', 404);
    }

    return successResponse(res, 'Campus retrieved successfully', campus);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Create a new constituent campus
 * POST /api/v1/system-setup/campuses
 */
const createCampus = async (req, res) => {
  try {
    const {
      name,
      code,
      campusNumber,
      region,
      district,
      address,
      contactEmail,
      contactPhone,
      directorName,
      aoEmail,
      deanAcademicsEmail,
      coeEmail,
      establishedYear,
      annualIntake,
      currentStrength,
      landAreaAcres,
      status,
    } = req.body;

    if (!name || !code || !region || !district || !contactEmail) {
      return errorResponse(
        res,
        'Campus Name, Code, Regional Jurisdiction, District, and Admin Email are required',
        400
      );
    }

    const normalizedCode = code.toUpperCase().trim();

    // Check for existing active campus with same code or name
    const existingCampus = await Campus.findOne({
      $or: [{ code: normalizedCode }, { name: name.trim() }],
      isDeleted: false,
    });

    if (existingCampus) {
      const field = existingCampus.code === normalizedCode ? 'code' : 'name';
      return errorResponse(res, `A campus with this ${field} already exists.`, 409);
    }

    const campus = await Campus.create({
      name: name.trim(),
      code: normalizedCode,
      campusNumber: campusNumber?.trim() || '',
      region,
      district: district.trim(),
      address: address?.trim() || '',
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone?.trim() || '',
      directorName: directorName?.trim() || '',
      aoEmail: aoEmail?.trim().toLowerCase() || '',
      deanAcademicsEmail: deanAcademicsEmail?.trim().toLowerCase() || '',
      coeEmail: coeEmail?.trim().toLowerCase() || '',
      establishedYear: establishedYear ? Number(establishedYear) : 2008,
      annualIntake: annualIntake ? Number(annualIntake) : 1100,
      currentStrength: currentStrength ? Number(currentStrength) : 7200,
      landAreaAcres: landAreaAcres ? Number(landAreaAcres) : 100,
      status: status || 'Active',
    });

    return successResponse(res, 'Campus created successfully', campus, 21);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'A campus with this code or name already exists.', 409);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Update campus details
 * PUT /api/v1/system-setup/campuses/:id
 */
const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({ _id: id, isDeleted: false });

    if (!campus) {
      return errorResponse(res, 'Campus not found', 404);
    }

    const {
      name,
      code,
      campusNumber,
      region,
      district,
      address,
      contactEmail,
      contactPhone,
      directorName,
      aoEmail,
      deanAcademicsEmail,
      coeEmail,
      establishedYear,
      annualIntake,
      currentStrength,
      landAreaAcres,
      status,
    } = req.body;

    if (code) {
      const normalizedCode = code.toUpperCase().trim();
      if (normalizedCode !== campus.code) {
        const duplicate = await Campus.findOne({
          code: normalizedCode,
          _id: { $ne: id },
          isDeleted: false,
        });
        if (duplicate) {
          return errorResponse(res, 'Another campus is already using this campus code.', 409);
        }
        campus.code = normalizedCode;
      }
    }

    if (name) campus.name = name.trim();
    if (campusNumber !== undefined) campus.campusNumber = campusNumber.trim();
    if (region) campus.region = region;
    if (district) campus.district = district.trim();
    if (address !== undefined) campus.address = address.trim();
    if (contactEmail) campus.contactEmail = contactEmail.trim().toLowerCase();
    if (contactPhone !== undefined) campus.contactPhone = contactPhone.trim();
    if (directorName !== undefined) campus.directorName = directorName.trim();
    if (aoEmail !== undefined) campus.aoEmail = aoEmail.trim().toLowerCase();
    if (deanAcademicsEmail !== undefined) campus.deanAcademicsEmail = deanAcademicsEmail.trim().toLowerCase();
    if (coeEmail !== undefined) campus.coeEmail = coeEmail.trim().toLowerCase();
    if (establishedYear !== undefined) campus.establishedYear = Number(establishedYear);
    if (annualIntake !== undefined) campus.annualIntake = Number(annualIntake);
    if (currentStrength !== undefined) campus.currentStrength = Number(currentStrength);
    if (landAreaAcres !== undefined) campus.landAreaAcres = Number(landAreaAcres);
    if (status) campus.status = status;

    await campus.save();

    return successResponse(res, 'Campus updated successfully', campus);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'A campus with this code or name already exists.', 409);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Soft delete a campus
 * DELETE /api/v1/system-setup/campuses/:id
 */
const deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({ _id: id, isDeleted: false });

    if (!campus) {
      return errorResponse(res, 'Campus not found or already deleted', 404);
    }

    campus.isDeleted = true;
    campus.deletedAt = new Date();
    campus.status = 'Inactive';
    await campus.save();

    return successResponse(res, `Campus ${campus.name} (${campus.code}) deleted successfully`, {
      id: campus._id,
      name: campus.name,
      code: campus.code,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getCampuses,
  getCampusStats,
  getCampusById,
  createCampus,
  updateCampus,
  deleteCampus,
};
