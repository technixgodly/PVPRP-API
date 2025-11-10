# PVPRP Parser API

This project provides a REST API to fetch and download resource packs from **pvprp.com**.

## Installation

1. Clone the repository or download the source code.
2. Install dependencies:

   ```bash
   npm install
   ```

## Starting the Server

Start the API server with:

```bash
npm start
```

The server will start on `http://localhost:3000`.

---

## API Endpoints

### 1. Fetch Packs

* **URL:** `/fetch`
* **Method:** `GET`

#### Allowed Query Parameters

| Parameter    | Type   | Description                                                        | Allowed Values / Format                                                                                           | Default | Example       |
| ------------ | ------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------- | ------------- |
| `search`     | String | The name of the pack or creator.                                   | Any text string                                                                                                   | (empty) | `faithful`    |
| `page`       | Number | The page number of search results.                                 | Positive integer                                                                                                  | `1`     | `2`           |
| `resolution` | String | One or more pack resolutions, comma-separated.                     | `16`, `32`, `64`, `128`, `256`, `512`                                                                             | (empty) | `16,32`       |
| `version`    | String | One or more Minecraft versions, comma-separated.                   | `1.7`, `1.8`, `1.9`, `1.10`, `1.11`, `1.12`, `1.13`, `1.14`, `1.15`, `1.16`, `1.17`, `1.18`, `1.19`, `1.20`       | (empty) | `1.8,1.16`    |
| `game`       | String | The game edition.                                                  | `jav` (Java/PC), `bed` (Bedrock)                                                                                  | `jav`   | `bed`         |
| `sort`       | String | The sorting order for results.                                     | `newol` (Newest → Oldest), `olnew` (Oldest → Newest), `az`, `za`, `dd` (Most Downloaded), `da` (Least Downloaded) | `dd`    | `newol`       |
| `tags`       | String | Comma-separated list of tags to filter by (as found on pvprp.com). | Valid tag names from pvprp.com                                                                                    | (empty) | `pvp,bedwars` |

---

#### Example Request

```bash
curl "http://localhost:3000/fetch?search=faithful&resolution=32&version=1.8&game=jav&sort=newol"
```

#### Example Response

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

---

### 2. Get Download Link

Fetches the download URL for the specified resource pack.

* **URL:** `/download`
* **Method:** `GET`

#### Query Parameters

| Parameter | Type   | Description                                            | Required |
| --------- | ------ | ------------------------------------------------------ | -------- |
| `url`     | String | The `packPageUrl` obtained from the `/fetch` endpoint. | Yes      |

#### Example Request

```bash
curl "http://localhost:3000/download?url=https://pvprp.com/pack/faithful-32x"
```

#### Example Response

```json
{
  "downloadUrl": "https://pvprp.com/download/..."
}
```
