#!/bin/bash

##############################################################################
# E-Store Deployment Script
# النشر السريع إلى Firebase Hosting + Cloud Run
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
  echo -e "\n${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
  print_header "Checking Requirements"
  
  command -v gcloud &> /dev/null || {
    print_error "gcloud CLI not found. Please install it first."
    exit 1
  }
  print_success "gcloud CLI found"
  
  command -v firebase &> /dev/null || {
    print_error "firebase-tools not found. Please install it first."
    exit 1
  }
  print_success "firebase-tools found"
  
  command -v docker &> /dev/null || {
    print_error "Docker not found. Please install it first."
    exit 1
  }
  print_success "Docker found"
}

# Get configuration
get_config() {
  print_header "Configuration Setup"
  
  # Check if .firebaserc exists and has valid project ID
  if [ ! -f ".firebaserc" ]; then
    print_error ".firebaserc file not found"
    exit 1
  fi
  
  # Extract PROJECT_ID from .firebaserc
  PROJECT_ID=$(grep -oP '"default":\s*"\K[^"]+' .firebaserc)
  
  if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "e-store-prod-123" ]; then
    print_warning "Project ID not configured. Please update .firebaserc with your actual GCP project ID."
    echo -e "${YELLOW}Example: ${NC}"
    echo '  {"projects": {"default": "your-actual-project-id"}}'
    exit 1
  fi
  
  print_success "Project ID: $PROJECT_ID"
  
  # Set default values
  REGION="${REGION:-us-central1}"
  SERVICE_NAME="${SERVICE_NAME:-e-store-app}"
  
  echo "Region: $REGION"
  echo "Service Name: $SERVICE_NAME"
}

# Authenticate with GCP
authenticate() {
  print_header "Authentication"
  
  # Check if already authenticated
  if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    print_success "Already authenticated with GCP"
  else
    print_warning "Not authenticated. Running gcloud auth login..."
    gcloud auth login
  fi
  
  # Set project
  gcloud config set project $PROJECT_ID
  print_success "Project set to $PROJECT_ID"
  
  # Ensure Firebase is logged in
  if ! firebase projects:list &> /dev/null; then
    print_warning "Not authenticated with Firebase. Running firebase login..."
    firebase login
  fi
  print_success "Firebase authenticated"
}

# Enable required APIs
enable_apis() {
  print_header "Enabling Required APIs"
  
  apis=(
    "run.googleapis.com"
    "artifactregistry.googleapis.com"
    "cloudbuild.googleapis.com"
    "secretmanager.googleapis.com"
  )
  
  for api in "${apis[@]}"; do
    echo "Enabling $api..."
    gcloud services enable $api --project=$PROJECT_ID
  done
  
  print_success "All required APIs enabled"
}

# Build and push Docker image
build_and_push() {
  print_header "Building and Pushing Docker Image"
  
  # Build locally first (to catch errors early)
  echo "Building Docker image locally..."
  docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .
  print_success "Docker image built successfully"
  
  # Configure Docker to use gcloud for authentication
  gcloud auth configure-docker gcr.io --quiet
  
  # Push to Google Container Registry
  echo "Pushing image to GCR..."
  docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
  print_success "Image pushed to gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"
}

# Deploy to Cloud Run
deploy_cloud_run() {
  print_header "Deploying to Cloud Run"
  
  echo "Deploying service to Cloud Run..."
  
  gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --timeout 3600 \
    --set-env-vars "NODE_ENV=production,APP_DOMAIN=https://$PROJECT_ID.web.app" \
    --project=$PROJECT_ID
  
  print_success "Cloud Run service deployed"
  
  # Get the service URL
  SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)' --project=$PROJECT_ID)
  echo -e "\nCloud Run Service URL: ${GREEN}$SERVICE_URL${NC}"
}

# Deploy to Firebase Hosting
deploy_firebase() {
  print_header "Deploying to Firebase Hosting"
  
  firebase deploy --only hosting --project=$PROJECT_ID
  
  print_success "Firebase Hosting deployed"
  
  HOSTING_URL="https://$PROJECT_ID.web.app"
  echo -e "\nHosting URL: ${GREEN}$HOSTING_URL${NC}"
}

# Verify deployment
verify_deployment() {
  print_header "Verifying Deployment"
  
  HOSTING_URL="https://$PROJECT_ID.web.app"
  
  echo "Testing endpoints..."
  
  # Test health endpoint
  echo "Testing /api/health..."
  if curl -sf "$HOSTING_URL/api/health" &> /dev/null; then
    print_success "Health check passed"
  else
    print_warning "Health check failed (may need a moment to initialize)"
  fi
  
  # Test root endpoint
  echo "Testing root (/)"
  if curl -sf "$HOSTING_URL/" &> /dev/null; then
    print_success "Root endpoint accessible"
  else
    print_warning "Root endpoint check failed"
  fi
  
  echo -e "\n${GREEN}Deployment Complete!${NC}"
  echo -e "\nYour application is available at: ${GREEN}$HOSTING_URL${NC}"
}

# View logs
view_logs() {
  print_header "Recent Deployment Logs"
  
  echo "Cloud Run logs (last 50 lines):"
  gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50 --project=$PROJECT_ID || echo "No logs available yet"
}

# Main flow
main() {
  print_header "E-Store Deployment Script"
  echo -e "Version: 1.0"
  echo -e "Target: Firebase Hosting + Cloud Run\n"
  
  # Ask for confirmation
  echo -e "${YELLOW}This script will:${NC}"
  echo "1. Check requirements (gcloud, firebase, docker)"
  echo "2. Verify GCP project configuration"
  echo "3. Build and push Docker image to Container Registry"
  echo "4. Deploy to Google Cloud Run"
  echo "5. Deploy to Firebase Hosting"
  echo -e "\n${YELLOW}Continue? (yes/no)${NC}"
  read -r response
  
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
  fi
  
  check_requirements
  get_config
  authenticate
  enable_apis
  build_and_push
  deploy_cloud_run
  deploy_firebase
  verify_deployment
  view_logs
  
  print_header "✓ Deployment Successful!"
  echo -e "Your app is live at: ${GREEN}https://$PROJECT_ID.web.app${NC}\n"
}

# Run main function
main "$@"
