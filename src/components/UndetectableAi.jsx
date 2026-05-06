async function getUrl(image) {
  try {
    const response = await fetch(
      `https://ai-image-detect.undetectable.ai/get-presigned-url?file_name=${encodeURIComponent(image.name)}&expiration=3600`,
      {
        method: "GET",
        headers: {
          apikey: "ac3df841-2c73-4424-8763-5fd58943a060",
        },
        accept: "application/json",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error occured in upload");
    console.log(error.message);
  }
}

async function uploadImage(image) {
  const url = await getUrl(image);
  try {
    const response = await fetch(`${url.presigned_url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
        "x-amz-acl": "private",
        accept: "application/json",
      },
      body: image,
    });

    return url.file_path;
  } catch (error) {
    console.log("error occured in upload");
    console.log(error.message);
  }
}

async function detectImage(image) {
  const url = await uploadImage(image);
  try {
    const response = await fetch(
      "https://ai-image-detect.undetectable.ai/detect",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "ac3df841-2c73-4424-8763-5fd58943a060",
          url: `https://ai-image-detector-prod.nyc3.digitaloceanspaces.com/${url}`,
          generate_preview: true,
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error occured in detect");
    console.log(error.message);
  }
}

async function getResult(id) {
  console.log(id.id);
  const interval = setInterval(async () => {
    try {
      const response = await fetch(
        "https://ai-image-detect.undetectable.ai/query",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id.id,
          }),
        },
      );
      const data = await response.json();
      console.log("poll:", data);

      if (data.status === "pending") {
        console.log("pending");
      }
      if (data.status === "analyzing") {
        console.log("analyzing");
      }
      if (data.status === "done") {
        clearInterval(interval);
        setResult(data);
        console.log(result);
      }
      if (data.status === "failed") {
        clearInterval(interval);
        console.log("failed");
      }
      if ((await detectImage(image)) === null) {
        clearInterval(interval);
        console.log("null");
      }
    } catch (error) {
      clearInterval(interval);
      console.log("error occured in result");
      console.log(error.message);
    }
  }, 2000);
}
