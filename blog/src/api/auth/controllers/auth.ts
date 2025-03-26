import { factories } from "@strapi/strapi";
import { sanitizeOutput } from "../../../utils/sanitizeOutput";// Import sanitize function
import jwt from "jsonwebtoken";


export default factories.createCoreController("plugin::users-permissions.user", ({ strapi }) => ({
  
  async register(ctx) {
    try {
      const { username, email, password, role } = ctx.request.body;

      if (!username || !email || !password) {
        return ctx.badRequest("Missing required fields");
      }

      // Check if user already exists
      const existingUser = await strapi.query("plugin::users-permissions.user").findOne({ where: { email } });

      if (existingUser) {
        return ctx.badRequest("Email already exists");
      }

      // Get the default role ("authenticated") if no role is provided
      const defaultRole = await strapi.query("plugin::users-permissions.role").findOne({
        where: { type: "authenticated" },
      });

      if (!defaultRole) {
        return ctx.internalServerError("Default role not found");
      }

      // Create new user
      const newUser = await strapi.plugins["users-permissions"].services.user.add({
        username,
        email,
        password,
        role: role || defaultRole.id,
      });

      // Sanitize user data
      const sanitizedUser = await sanitizeOutput(newUser, strapi);

      return ctx.send({ user: sanitizedUser }, 201);
    } catch (error) {
      strapi.log.error("User registration error:", error);
      return ctx.internalServerError("Something went wrong during registration");
    }
  },
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body; // Use 'identifier' instead of 'email'

      if (!identifier || !password) {
        return ctx.badRequest("Missing identifier or password");
      }

      // Find user by email or username
      const user = await strapi.query("plugin::users-permissions.user").findOne({ 
        where: { $or: [{ email: identifier }, { username: identifier }] }
      });

      if (!user) {
        return ctx.unauthorized("Invalid identifier or password");
      }

      // Validate password
      const isValidPassword = await strapi.plugins["users-permissions"].services.user.validatePassword(password, user.password);
      if (!isValidPassword) {
        return ctx.unauthorized("Invalid identifier or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role.id },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      // Send response with JWT
      return ctx.send({ jwt: token, user });
    } catch (error) {
      strapi.log.error("Login error:", error);
      return ctx.internalServerError("Something went wrong during login");
    }
  },

}));
