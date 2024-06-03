module.exports.checkEnv = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      port: process.env.PORT || 2345,
    }),
  };
};
