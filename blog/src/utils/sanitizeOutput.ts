import { sanitize } from "@strapi/utils";

export const sanitizeOutput = async (data, strapi) => {
  const schema = strapi.contentType("plugin::users-permissions.user");

  return await sanitize.sanitizers.defaultSanitizeOutput(schema, data);
};
