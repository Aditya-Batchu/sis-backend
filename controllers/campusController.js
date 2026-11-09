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
 *
 * HOMEWORK: complete this handler. Use getCampusById and createCampus above as the pattern.
 */
const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({ _id: id, isDeleted: false });

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

    // 1. If campus was not found, return errorResponse with 'Campus not found' and status 404.

    // 2. If a new code was sent and it is different from campus.code:
    //    - trim it and convert it to uppercase
    //    - find another active campus (isDeleted: false) that already uses that code, excluding this id
    //    - if one exists, return errorResponse with status 409
    //    - otherwise assign the normalized code to campus.code

    // 3. Copy the remaining body fields onto campus only when they were sent.
    //    Trim strings, lowercase email fields, and convert year / intake / strength / land area with Number().
    //    Follow the same field cleaning used in createCampus.

    // 4. Save the campus document.

    // 5. Return successResponse with message 'Campus updated successfully' and the updated campus.

    // Remove this line once the steps above return a response.
    return errorResponse(res, 'Update campus is not implemented yet', 501);
  } catch (error) {
    // If error.code is 11000, the code or name is already taken. Return status 409.
    // Same check as the catch block in createCampus.
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Soft delete a campus
 * DELETE /api/v1/system-setup/campuses/:id
 *
 * HOMEWORK: complete this handler. Do not remove the document from MongoDB.
 */
const deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await Campus.findOne({ _id: id, isDeleted: false });

    // 1. If campus was not found, return errorResponse with
    //    'Campus not found or already deleted' and status 404.

    // 2. Soft delete the campus:
    //    - set isDeleted to true
    //    - set deletedAt to the current date
    //    - set status to 'Inactive'
    //    Do not use deleteOne or findByIdAndDelete.

    // 3. Save the campus document.

    // 4. Return successResponse. Include the campus name and code in the message,
    //    and send back { id, name, code }.

    // Remove this line once the steps above return a response.
    return errorResponse(res, 'Delete campus is not implemented yet', 501);
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
