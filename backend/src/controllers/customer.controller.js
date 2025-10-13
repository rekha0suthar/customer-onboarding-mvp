import Customer from '../models/Customer.model.js';
import OnboardingActivity from '../models/OnboardingActivity.model.js';

class CustomerController {
  async getProfile(req, res) {
    try {
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      res.json({
        message: 'Profile retrieved successfully',
        customer,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const allowedFields = [
        'first_name', 'last_name', 'gstin', 'phone', 'date_of_birth',
        'address', 'city', 'state', 'zip_code', 'country'
      ];

      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      let updatedCustomer;
      try {
        updatedCustomer = await Customer.update(customer.id, updateData);
      } catch (updateError) {
        if (updateError.code === '23505' && updateError.constraint === 'customers_gstin_key') {
          return res.status(400).json({ error: 'GSTIN number already registered by another customer' });
        }
        throw updateError;
      }

      await OnboardingActivity.create(
        customer.id,
        'PROFILE_UPDATE',
        'Customer updated profile information'
      );

      res.json({
        message: 'Profile updated successfully',
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
  }

  async getOnboardingStatus(req, res) {
    try {
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const activities = await OnboardingActivity.findByCustomerId(customer.id, 10);

      res.json({
        status: customer.onboarding_status,
        current_step: customer.onboarding_step,
        customer: {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          onboarding_status: customer.onboarding_status,
          onboarding_step: customer.onboarding_step,
        },
        recent_activities: activities,
      });
    } catch (error) {
      console.error('Get onboarding status error:', error);
      res.status(500).json({ error: 'Failed to fetch onboarding status', details: error.message });
    }
  }

  async updateOnboardingStep(req, res) {
    try {
      const { status, step } = req.body;
      
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const updatedCustomer = await Customer.updateOnboardingStatus(
        customer.id,
        status || customer.onboarding_status,
        step || customer.onboarding_step
      );

      await OnboardingActivity.create(
        customer.id,
        'STEP_COMPLETED',
        `Onboarding step ${step} completed. Status: ${status}`
      );

      res.json({
        message: 'Onboarding step updated successfully',
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error('Update onboarding step error:', error);
      res.status(500).json({ error: 'Failed to update onboarding step', details: error.message });
    }
  }

  async getActivities(req, res) {
    try {
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const limit = parseInt(req.query.limit) || 50;
      const activities = await OnboardingActivity.findByCustomerId(customer.id, limit);

      res.json({
        message: 'Activities retrieved successfully',
        count: activities.length,
        activities,
      });
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
    }
  }
}

export default new CustomerController();
