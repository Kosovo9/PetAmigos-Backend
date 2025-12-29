#!/bin/bash
# Quick test script for deployed APIs

BASE_URL="${1:-http://localhost:5000}"

echo "🧪 Testing PetAmigos Backend: $BASE_URL"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test counter
PASSED=0
FAILED=0

test_endpoint() {
  local name=$1
  local endpoint=$2
  local expected_code=${3:-200}
  
  echo -n "Testing $name... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" --max-time 10)
  
  if [ "$response" -eq "$expected_code" ]; then
    echo -e "${GREEN}✓ PASS${NC} ($response)"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected: $expected_code, Got: $response)"
    ((FAILED++))
  fi
}

# Test endpoints
echo ""
echo "🏥 Health Checks:"
test_endpoint "Health endpoint" "/health" 200

echo ""
echo "🔒 Security Headers:"
response_headers=$(curl -s -I "$BASE_URL/health")
if echo "$response_headers" | grep -q "X-Content-Type-Options"; then
  echo -e "${GREEN}✓ Security headers present${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Security headers missing${NC}"
  ((FAILED++))
fi

echo ""
echo "🌐 CORS Configuration:"
cors_test=$(curl -s -H "Origin: https://petmatch-global.netlify.app" \
                    -H "Access-Control-Request-Method: GET" \
                    -X OPTIONS \
                    -I "$BASE_URL/api/pets" 2>&1)

if echo "$cors_test" | grep -q "Access-Control-Allow-Origin"; then
  echo -e "${GREEN}✓ CORS configured${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ CORS not configured${NC}"
  ((FAILED++))
fi

echo ""
echo "📊 API Endpoints:"
test_endpoint "Pets API" "/api/pets" 200
test_ "Auth health" "/api/auth/health" 200 404
test_endpoint "Admin API (protected)" "/api/admin/metrics" 401

echo ""
echo "========================================"
echo "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️ Some tests failed!"
  exit 1
fi
