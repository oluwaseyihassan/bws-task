# Football Predictions API

A NestJS-based REST API that fetches and filters football fixtures with predictions from the SportMonks API. The application provides cached responses and filtering capabilities for improved performance and user experience.

## Features

- 🏈 Fetch football fixtures and predictions by date
- 🔍 Search fixtures by team/league name
- 📊 Filter predictions by percentage confidence
- 💾 MongoDB-based caching system
- 🚀 Fast response times with automatic cache management
- 🛡️ Input validation and error handling
- 📝 Comprehensive logging

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **External API**: SportMonks Football API
- **Caching**: Custom MongoDB-based cache
- **Validation**: class-validator
- **HTTP Client**: Axios
- **Language**: TypeScript

## Prerequisites

- Node.js (v18+)
- MongoDB instance
- SportMonks API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bws-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_sportmonks_api_key
   BASE_URL=https://api.sportmonks.com/v3/football
   MONGODB_URI=mongodb://localhost:27017/football-predictions
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Get Predictions by Date

Fetch football fixtures with predictions for a specific date.

```http
GET /prediction/:date
```

**Parameters:**
- `date` (required): Date in YYYY-MM-DD format
- `include` (optional): Additional data to include (e.g., "predictions,teams")
- `filters` (optional): API filters
- `select` (optional): Specific fields to select
- `filterByPercentage` (optional): Minimum prediction percentage (default: 50)

**Example:**
```bash
curl "http://localhost:3000/prediction/2025-08-12?include=predictions&filterByPercentage=60"
```

**Response:**
```json
{
  "success": true,
  "message": "Filtered predictions fetched successfully",
  "data": {
    "data": [
      {
        "id": 12345,
        "name": "Team A vs Team B",
        "predictions": [
          {
            "type_id": 237,
            "predictions": {
              "home": 65,
              "away": 35
            }
          }
        ]
      }
    ]
  }
}
```

### Search Fixtures by Name

Search for fixtures by team or league name.

```http
GET /prediction/search/:name
```

**Parameters:**
- `name` (required): Team or league name to search
- `include` (optional): Additional data to include
- `filters` (optional): API filters
- `select` (optional): Specific fields to select
- `perPage` (optional): Results per page (default: 50)

**Example:**
```bash
curl "http://localhost:3000/prediction/search/Arsenal?include=teams"
```

## Project Structure

```
src/
├── app.module.ts                 # Main application module
├── main.ts                       # Application entry point
├── cache/                        # Caching system
│   ├── cache.module.ts
│   ├── cache.service.ts
│   └── cache.schema.ts
├── prediction/                   # Prediction module
│   ├── controllers/
│   │   └── prediction.controller.ts
│   ├── services/
│   │   ├── prediction/
│   │   │   └── prediction.service.ts
│   │   └── external-api/
│   │       └── external-api.service.ts
│   ├── validators/
│   │   └── date.validator.ts
│   ├── decorators/
│   │   └── valid-date.decorator.ts
│   └── prediction.module.ts
├── types/                        # TypeScript type definitions
│   └── types.ts
└── utils/                        # Utility functions
    └── response.ts
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `API_KEY` | SportMonks API key | Yes | - |
| `BASE_URL` | SportMonks API base URL | Yes | - |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `PORT` | Application port | No | 3000 |

### Cache Configuration

The application uses a MongoDB-based caching system with the following settings:

- **Predictions Cache TTL**: 30 minutes
- **Fixtures Cache TTL**: 60 minutes
- **Automatic Cleanup**: Expired cache entries are automatically removed

## Data Flow

1. **Request Validation**: Input parameters are validated using custom decorators
2. **Cache Check**: System checks if data exists in cache and is not expired
3. **External API Call**: If cache miss, fetches data from SportMonks API
4. **Data Processing**: Filters fixtures with predictions and applies percentage filtering
5. **Cache Storage**: Stores processed results in MongoDB cache
6. **Response**: Returns formatted success/error response

## Error Handling

The application implements comprehensive error handling:

- **Validation Errors**: Invalid date formats, missing parameters
- **API Errors**: External API failures, rate limiting
- **Database Errors**: MongoDB connection issues
- **Cache Errors**: Cache operations failures (non-blocking)

## Performance Optimizations

- **Intelligent Caching**: Reduces external API calls
- **Pagination Handling**: Automatically fetches all pages from external API
- **Data Filtering**: Client-side filtering reduces response size
- **Connection Pooling**: Efficient database connections
- **Async Operations**: Non-blocking I/O operations

## Development

### Available Scripts

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint
```

### Adding New Endpoints

1. Create controller method in `prediction.controller.ts`
2. Add business logic in `prediction.service.ts`
3. Add external API calls in `external-api.service.ts`
4. Update types in `types.ts` if needed

## API Rate Limits

SportMonks API has rate limits. The caching system helps reduce API calls:

- **Free Plan**: 180 requests/hour
- **Paid Plans**: Higher limits available

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.