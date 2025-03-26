export default [
    {
      method: "POST",
      path: "/auth/register",
      handler: "api::auth.auth.register",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/login",
      handler: "api::auth.auth.login",
      config: {
        auth: false,
      },
    },
  ];
  