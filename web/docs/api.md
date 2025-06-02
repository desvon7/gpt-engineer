# API Documentation

## Authentication
All API endpoints require authentication using Supabase Auth. The authentication token should be included in the request headers.

## Projects

### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "string",
  "description": "string"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "user_id": "uuid",
  "files": {},
  "status": "draft",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Get Project
```http
GET /api/projects/:id
```

Response:
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "user_id": "uuid",
  "files": {},
  "status": "draft",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Update Project
```http
PUT /api/projects/:id
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "files": {},
  "status": "draft"
}
```

Response: Updated project object

### Delete Project
```http
DELETE /api/projects/:id
```

Response: 204 No Content

### List Projects
```http
GET /api/projects
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "user_id": "uuid",
    "files": {},
    "status": "draft",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

## Deployments

### Create Deployment
```http
POST /api/deployments
Content-Type: application/json

{
  "project_id": "uuid",
  "environment": {}
}
```

Response:
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "status": "pending",
  "url": "string",
  "build_logs": [],
  "environment": {},
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Get Deployment
```http
GET /api/deployments/:id
```

Response: Deployment object

### Get Deployment Status
```http
GET /api/deployments/:id/status
```

Response:
```json
{
  "id": "uuid",
  "status": "pending|building|deployed|failed",
  "url": "string",
  "build_logs": []
}
```

### Get Deployment Logs
```http
GET /api/deployments/:id/logs
```

Response:
```json
[
  "string"
]
```

## Build and Deploy

### Build Project
```http
POST /api/build
Content-Type: application/json

{
  "projectId": "uuid",
  "deploymentId": "uuid",
  "environment": {}
}
```

Response:
```json
{
  "message": "Build started"
}
```

### Deploy Project
```http
POST /api/deploy
Content-Type: application/json

{
  "projectId": "uuid",
  "deploymentId": "uuid"
}
```

Response:
```json
{
  "message": "Deployment started"
}
```

## Environment Variables

### Set Environment Variable
```http
POST /api/projects/:id/environment
Content-Type: application/json

{
  "key": "string",
  "value": "string"
}
```

Response: 204 No Content

### Get Environment Variables
```http
GET /api/projects/:id/environment
```

Response:
```json
[
  {
    "key": "string",
    "value": "string"
  }
]
```

### Delete Environment Variable
```http
DELETE /api/projects/:id/environment/:key
```

Response: 204 No Content

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "string"
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 405: Method Not Allowed
- 500: Internal Server Error 