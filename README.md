# API Documentation

This API allows for user registration, login, logout, and health check, as well as testing the database connection.

## Endpoints

### 1. Root Endpoints
#### `GET /`
Check if the API is conected correctly.

**Response:**
- **200 OK** - If the api is connected successfully.
- **404 Not Found** - If the api connection not found.

  Response:
  ```bash
   {
    "status": "200,
    "message": "API connection successfuly",
  }

### 2. AUTH Endpoints
#### `GET api/auth/supabase/google`
**Response:**
- **200 OK** - If the api is connected successfully.
- **404 Not Found** - If the api connection not found.

  Response:
  ```bash
   {
    "status": "200,
    "message": "Login successfuly",
    "token" : {
         "access_token" : "auth access token",
         "refresh_token : "auth refresh token",
         "expires_in : "number",
         "expires_at" : "number"
         "expire_date" : "date time"
    },
    "user" : {
            "id" : "user uuid",
            "email" : "user email",
            "name" : "user's name"
            "fullname: "user fullname"
            "avatar_url" : "avatar photo profile url"
      }
  }
  
#### `GET /auth/supabase/logout`
**Response:**
- **200 OK** - If the api is connected successfully.
- **404 Not Found** - If the api connection not found.
  

  ```bash
  {
   "status": "200,
   "message": "Logout successfuly",
    }


### 3. Press Release Endpoints

### 🔐 Authorization

This endpoint requires a Bearer Token.

**Header:**

| Key           | Value Format            | Required |   Value |
|----------------|-------------------------|----------|--------|
| Authorization | `Bearer <access_token>` | ✅ Yes   | <acces_token> |


## Store New Press Release
#### `POST /press-releases`
 Create Form
 - Textarea name field => contents[index][content]
 - File Input Image name field => contents[index]][image]



Request ( form data / multipart data ):
![image](https://github.com/user-attachments/assets/4be16af9-f12f-428d-9ece-b253c205af56)



  ```bash
   {
    "title": "press release title" (required),
    "date": "YYYY-MM-DD" (required),
    "time": "Hours:Minute" (required),
    "contents" : [
      {
        "content" : "kontenku"
        "image" : <file image>
      }
    ],
  
```
## Delete Press Release
#### `DELETE /press-releases /{press-release uuid}`
 Response:
  ```bash
   {
    "status": "200,
    "message": "Press release deleted successfully",
  }

 ```
## Read All Press Release
#### `GET /press-releases`
 Response:
  ```bash
   {
    "status": "200,
    "message": "Press releases retrieved successfully",
    "data" : [
        {
            id: press release id,
            press_uuid: "press release uuid",
            title: "press release title",
            date: "press release date",
            time: "press release create time",
            created_at: "2025-02-22T10:00:38.000000Z",
            updated_at: "2025-02-22T10:00:38.000000Z"
        }
        ...........

    ]
  }

 ```

## Read Press Release And Contents By UUID
#### `GET /press-releases /{press-release uuid}`

 Response:
  ```bash
   {
    "status": "200,
    "message": "Press releases retrieved successfully",
    "data" : [
        {
            id: press release id,
            press_uuid: "press release uuid",
            title: "press release title",
            date: "press release date",
            time: "press release create time",
            created_at: "2025-02-22T10:00:38.000000Z",
            updated_at: "2025-02-22T10:00:38.000000Z"
            contents: [
                        {
                        id: press release content id,
                        press_release_id: press release content id,
                        image_url: "press release content image url",
                        content: "press release content text",
                        created_at: "2025-02-22T10:00:38.000000Z",
                        updated_at: "2025-02-27T05:53:56.000000Z"
                        }
                    ...........
                    ]
        }
        ...........

    ]
  }

 ```
## Update Press Release And Content
#### `PUT /press-releases/{press-release uuid}`
Request ( form data / multipart data ):
  ```bash
   {
    "title": "press release title",
    "date": "YYYY-MM-DD",
    "time": "Hours:Minute",
    "contents" :array {
          0 => array {
            "content" : "string text content",
            "image"   : image file
         },
          1 => array {
            "content" : "string text content",
            "image"   : image file
         },
        .........
  }
```

### 4. Gallery Endpoints

### 🔐 Authorization

This endpoint requires a Bearer Token.

**Header:**

| Key           | Value Format            | Required |   Value |
|----------------|-------------------------|----------|--------|
| Authorization | `Bearer <access_token>` | ✅ Yes   | <acces_token> |

## Store New Gallery
#### `POST /gallery`
  Request ( form data / multipart data ):
  ```bash
   {
    "caption": "caption text",
    "image": image file,
  }
  ```
## Read All Gallery 
#### `GET /gallery`

 Response:
  ```bash
   {
    "status": "200,
    "message": "Gallery retrieved successfully",
    "data" : [
        {
            "id": "gallery id" ,
            "gallery_uuid" : "gallery uuid",
            image_url: "gallery image url",
            caption: null,
            created_at: "2025-03-01T04:29:26.000000Z",
            updated_at: "2025-03-01T04:29:26.000000Z"
        }
        ...........

    ]
  }

 ```
 ## Read Gallery By UUID 
 #### `GET /gallery/{ gallery uuid }`

  Response:
  ```bash
   {
    "status": "200,
    "message": "Gallery retrieved successfully",
    "data" : {
            "id": "gallery id" ,
            "gallery_uuid" : "gallery uuid",
            image_url: "gallery image url",
            caption: null,
            created_at: "2025-03-01T04:29:26.000000Z",
            updated_at: "2025-03-01T04:29:26.000000Z"
        }
  }
```
## Update Gallery Data 
#### `PUT /gallery/{gallery uuid}`
 Request ( form data / multipart data ):
  ```bash
   {
    "caption": "caption text",
    "image": image file,
  }
  ```

## Delete Gallery
#### `DELETE /gallery/{gallery uuid}`
 Response:
  ```bash
   {
    "status": "200,
    "message": "Gallery deleted successfully",
  }

 ```

### 5. Carrer Endpoints

### 🔐 Authorization

This endpoint requires a Bearer Token.

**Header:**

| Key           | Value Format            | Required |   Value |
|----------------|-------------------------|----------|--------|
| Authorization | `Bearer <access_token>` | ✅ Yes   | <acces_token> |

## Store New Carrer
#### `POST /carrer`

 Request ( form data / multipart data ):
  ```bash
   {
    "image": image file,
    "description": "description text",
    "link" : "url link"
  }
  ```

## Read All Carrer 
#### `GET /carrer`
 Response:
  ```bash
   {
    "status": "200,
    "message": "Carrer retrieved successfully",
    "data" : [
        {
          "id":  "carrer id",
          carrer_uuid: "carrer uuid",
          image_url: "carrer image url,
          deskripsi: "carrer description",
          link: "carrer link",
          created_at: "2025-03-01T07:39:17.000000Z",
          updated_at: "2025-03-01T07:39:17.000000Z"
        }
        ...........

    ]
  }

 ```

## Read Carrer By UUID 
#### `GET /carrer/{ carrer uuid }`
  Response:
  ```bash
   {
    "status": "200,
    "message": "Carrer retrieved successfully",
    "data" : {
          "id":  "carrer id",
          carrer_uuid: "carrer uuid",
          image_url: "carrer image url,
          deskripsi: "carrer description",
          link: "carrer link",
          created_at: "2025-03-01T07:39:17.000000Z",
          updated_at: "2025-03-01T07:39:17.000000Z"
        }
      
  }

 ```

## Update Carrer Data 
#### `PUT /carrer/{gallery uuid}`
 Request ( form data / multipart data ):
   ```bash
   {
    "image": image file,
    "description": "description text",
    "link" : "url link"
  }
  ```

## Delete Carrer Data
#### `DELETE /carrer/{carrer uuid}`
 Response:
  ```bash
   {
    "status": "200,
    "message": "carrer deleted successfully",
  }

 ```
  
