// for quick import/export (slightly manual)
/**
 * To quickly zip files:
Compress-Archive -Path index.mjs -DestinationPath function.zip -Force
 * Deploy to AWS console:
aws lambda update-function-code --function-name portfolio-api --zip-file fileb://function.zip
 */

export const handler = async (event) => {
  const method = event.requestContext.http.method;
  const path = event.rawPath

  if (method === 'GET' && path === '/projects') {
    return jsonResponse({
      message: 'This is from AWS lambda VSC!'
    });
  }

  return jsonResponse({error: 'Not found'}, 404);
};


function jsonResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers:
    { 'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(data)
  };
}
