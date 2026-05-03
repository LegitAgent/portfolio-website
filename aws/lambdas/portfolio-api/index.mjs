// for quick import/export (slightly manual)
/**
 * To quickly zip files:
Compress-Archive -Path index.mjs -DestinationPath function.zip -Force
 * Deploy to AWS console:
aws lambda update-function-code --function-name portfolio-api --zip-file fileb://function.zip
 */

export const handler = async (event) => {
  // TODO implement
  const data = {
    'message' : 'This is from AWS lambda VSC!'
  }
  const response = {
    statusCode: 200,
    headers:
      { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    body: JSON.stringify(data),
  };
  return response;
};
