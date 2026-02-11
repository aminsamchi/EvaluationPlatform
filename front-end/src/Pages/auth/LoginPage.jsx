import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { ROUTES, USER_ROLES, STORAGE_KEYS } from '../../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: USER_ROLES.ORGANIZATION // Default role
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Please select a role';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create mock user with selected role
    const mockUser = {
      id: Date.now(),
      email: formData.email,
      name: formData.email.split('@')[0], // Use email prefix as name
      role: formData.role,
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-token-' + Date.now());
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

    // Track all users in a persistent registry (for admin dashboard stats)
    const allUsers = JSON.parse(localStorage.getItem('governance_all_users') || '{}');
    allUsers[formData.email] = mockUser;
    localStorage.setItem('governance_all_users', JSON.stringify(allUsers));
    console.log('🔐 Login - User registry updated:', allUsers);

    // Redirect based on role
    if (formData.role === USER_ROLES.ORGANIZATION) {
      navigate(ROUTES.ORG_DASHBOARD);
    } else if (formData.role === USER_ROLES.EVALUATOR) {
      navigate(ROUTES.EVAL_DASHBOARD);
    } else if (formData.role === USER_ROLES.ADMINISTRATOR) {
      navigate(ROUTES.ADMIN_DASHBOARD);
    } else {
      navigate(ROUTES.ORG_DASHBOARD); // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to Governance Evaluation Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: USER_ROLES.ORGANIZATION })}
                  className={`p-4 rounded-lg border-2 transition-all ${formData.role === USER_ROLES.ORGANIZATION
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">Organization</div>
                    <div className="text-xs mt-1 text-gray-500">Submit evaluations</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: USER_ROLES.EVALUATOR })}
                  className={`p-4 rounded-lg border-2 transition-all ${formData.role === USER_ROLES.EVALUATOR
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">Evaluator</div>
                    <div className="text-xs mt-1 text-gray-500">Review submissions</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: USER_ROLES.ADMINISTRATOR })}
                  className={`p-4 rounded-lg border-2 transition-all ${formData.role === USER_ROLES.ADMINISTRATOR
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">Admin</div>
                    <div className="text-xs mt-1 text-gray-500">Manage platform</div>
                  </div>
                </button>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth>
              Sign In as {formData.role === USER_ROLES.ORGANIZATION ? 'Organization' : formData.role === USER_ROLES.EVALUATOR ? 'Evaluator' : 'Administrator'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          🔒 Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default LoginPage;