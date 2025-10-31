# PVPRP Parser API

This project provides a REST API to fetch and download resource packs from pvprp.com.

## Installation

1. Clone the repository or download the source code.
2. Install the dependencies:
   ```bash
   npm install
   ```

## Starting the Server

To start the API server, run the following command:

```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### 1. Fetch Packs

This endpoint allows you to search for resource packs with various filters.

- **URL:** `/fetch`
- **Method:** `GET`
- **Query Parameters:**

| Parameter    | Type   | Description                                                                                                                                 | Default | Example                               |
|--------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------|---------|---------------------------------------|
| `search`     | String | The name of the pack or creator.                                                                                                            | (empty) | `My%20Awesome%20Pack`                  |
| `page`       | Number | The page number of the search results.                                                                                                      | `1`     | `2`                                   |
| `resolution` | String | A comma-separated list of resolutions. (e.g., 16, 32, 64)                                                                                    | (empty) | `16,32`                               |
| `version`    | String | A comma-separated list of Minecraft versions. (e.g., 1.8, 1.12)                                                                               | (empty) | `1.8,1.16`                            |
| `game`       | String | The game edition. Can be `jav` (Java) or `bed` (Bedrock).                                                                                     | `jav`   | `bed`                                 |
| `sort`       | String | The sorting order. Possible values: `newol`, `olnew`, `az`, `za`, `dd` (most downloaded), `da` (least downloaded).                              | `dd`    | `newol`                               |
| `tags`       | String | A comma-separated list of tags to filter by. A full list of tags can be found on the pvprp.com website.                                       | (empty) | `pvp,bedwars`                         |

- **Example Request:**

  ```bash
  curl "http://localhost:3000/fetch?search=faithful&resolution=32&tags=pvp"
  ```

- **Example Response:**

  ```json
  [
    {
      "packName": "Faithful 32x",
      "author": "Vattic",
      "resolution": "32x",
      "packIconUrl": "https://pvprp.com/...",
      "authorPfpUrl": "https://pvprp.com/...",
      "authorProfileUrl": "https://pvprp.com/...",
      "views": "1.2M",
      "downloads": "500K",
      "packPageUrl": "https://pvprp.com/pack/faithful-32x"
    }
  ]
  ```

### 2. Get Download Link

This endpoint retrieves the direct download URL for a specific resource pack.

- **URL:** `/download`
- **Method:** `GET`
- **Query Parameters:**

| Parameter | Type   | Description                                                 | Required |
|-----------|--------|-------------------------------------------------------------|----------|
| `url`     | String | The `packPageUrl` obtained from the `/fetch` endpoint.      | Yes      |

- **Example Request:**

  ```bash
  curl "http://localhost:3000/download?url=https://pvprp.com/pack/faithful-32x"
  ```

- **Example Response:**

  ```json
  {
    "downloadUrl": "https://pvprp.com/download/..."
  }
  ```