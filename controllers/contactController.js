const Contact = require('../models/Contact');
const { sendAdminNotification, sendUserConfirmation } = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create contact entry in database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Send emails (don't wait for them to complete)
    Promise.all([
      sendAdminNotification(contact),
      sendUserConfirmation(contact),
    ]).catch((err) => {
      console.error('Email sending error:', err);
      // Don't fail the request if emails fail
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    // Build query
    const query = status && status !== 'all' ? { status } : {};
    
    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    // Count by status
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      stats: stats,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    // Mark as read if status is 'new'
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private
exports.updateContact = async (req, res, next) => {
  try {
    const { status, notes, replied } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        replied,
        ...(replied && { repliedAt: new Date() }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};