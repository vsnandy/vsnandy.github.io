const baseUrl = process.env.VSNANDY_API_GW_URL;

// Gets school list
export const getAllSchools = async () => {
  console.log("[NCAA API] - Getting all schools");

  const response = await fetch(`${baseUrl}/schools`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });

  console.log("[NCAA API] Response: " + response);

  if(response.status === 200) {
    const result = await response.json();
    return {
      status: response.status,
      result
    }
  }

  throw new Error('[NCAA API] - Response was not ok!');
}