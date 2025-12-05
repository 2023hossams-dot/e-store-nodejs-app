#!/bin/bash

##############################################################################
# Setup Secrets Script
# إعداد الأسرار في Google Cloud Secret Manager
##############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Extract PROJECT_ID from .firebaserc
get_project_id() {
  if [ ! -f ".firebaserc" ]; then
    print_error ".firebaserc not found"
    exit 1
  fi
  PROJECT_ID=$(grep -oP '"default":\s*"\K[^"]+' .firebaserc)
  if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "e-store-prod-123" ]; then
    print_error "Invalid or placeholder PROJECT_ID. Please update .firebaserc first."
    exit 1
  fi
  echo $PROJECT_ID
}

main() {
  print_header "Secret Manager Setup"
  
  PROJECT_ID=$(get_project_id)
  REGION="${REGION:-us-central1}"
  SERVICE_NAME="${SERVICE_NAME:-e-store-app}"
  
  echo "Project ID: $PROJECT_ID"
  echo "Region: $REGION"
  echo "Service Name: $SERVICE_NAME"
  
  # Set project
  gcloud config set project $PROJECT_ID
  
  # Enable Secret Manager API
  echo -e "\nEnabling Secret Manager API..."
  gcloud services enable secretmanager.googleapis.com --quiet
  print_success "Secret Manager API enabled"
  
  # Get MongoDB URI
  print_header "MongoDB URI"
  echo "Enter your MongoDB URI (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname):"
  read -r MONGODB_URI
  
  if [ -z "$MONGODB_URI" ]; then
    print_warning "MongoDB URI is empty. Skipping..."
  else
    echo "Creating MONGODB_URI secret..."
    echo -n "$MONGODB_URI" | gcloud secrets create MONGODB_URI --data-file=- 2>/dev/null || {
      echo "Secret already exists, updating..."
      echo -n "$MONGODB_URI" | gcloud secrets versions add MONGODB_URI --data-file=-
    }
    print_success "MONGODB_URI secret created/updated"
  fi
  
  # Get SESSION_SECRET
  print_header "SESSION_SECRET"
  echo "Enter your SESSION_SECRET (or press Enter to generate one):"
  read -r SESSION_SECRET
  
  if [ -z "$SESSION_SECRET" ]; then
    SESSION_SECRET=$(openssl rand -base64 32)
    echo "Generated SESSION_SECRET: $SESSION_SECRET"
  fi
  
  echo "Creating SESSION_SECRET secret..."
  echo -n "$SESSION_SECRET" | gcloud secrets create SESSION_SECRET --data-file=- 2>/dev/null || {
    echo "Secret already exists, updating..."
    echo -n "$SESSION_SECRET" | gcloud secrets versions add SESSION_SECRET --data-file=-
  }
  print_success "SESSION_SECRET secret created/updated"
  
  # Get JWT_SECRET
  print_header "JWT_SECRET"
  echo "Enter your JWT_SECRET (or press Enter to generate one):"
  read -r JWT_SECRET
  
  if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
  fi
  
  echo "Creating JWT_SECRET secret..."
  echo -n "$JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=- 2>/dev/null || {
    echo "Secret already exists, updating..."
    echo -n "$JWT_SECRET" | gcloud secrets versions add JWT_SECRET --data-file=-
  }
  print_success "JWT_SECRET secret created/updated"
  
  # Grant Cloud Run service account access
  print_header "Granting Service Account Access"
  
  SERVICE_ACCOUNT="${PROJECT_ID}@appspot.gserviceaccount.com"
  
  for secret in MONGODB_URI SESSION_SECRET JWT_SECRET; do
    echo "Granting access to $secret..."
    gcloud secrets add-iam-policy-binding $secret \
      --member=serviceAccount:$SERVICE_ACCOUNT \
      --role=roles/secretmanager.secretAccessor \
      --quiet 2>/dev/null || echo "  (Already granted or skipped)"
  done
  
  print_success "Service account permissions configured"
  
  print_header "✓ Secrets Setup Complete!"
  echo -e "\nYour secrets are now stored in Google Cloud Secret Manager."
  echo -e "Next step: Run ${GREEN}./deploy.sh${NC} to deploy your application.\n"
}

main "$@"
