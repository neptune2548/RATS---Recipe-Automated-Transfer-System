#!/bin/bash
# scaffold.sh
# วิธีใช้: bash scaffold.sh

PROJECT_NAME="arc-system"

# ===== SERVER (Express - Auth + Recipe API + MEMS API/WebSocket) =====
mkdir -p $PROJECT_NAME/server/auth
mkdir -p $PROJECT_NAME/server/modules/recipe
mkdir -p $PROJECT_NAME/server/modules/mems
mkdir -p $PROJECT_NAME/server/db/models

touch $PROJECT_NAME/server/auth/auth.controller.js
touch $PROJECT_NAME/server/auth/auth.middleware.js
touch $PROJECT_NAME/server/auth/roles.js

touch $PROJECT_NAME/server/modules/recipe/recipe.routes.js
touch $PROJECT_NAME/server/modules/recipe/recipe.controller.js
touch $PROJECT_NAME/server/modules/recipe/secsgem.service.js

touch $PROJECT_NAME/server/modules/mems/mems.routes.js
touch $PROJECT_NAME/server/modules/mems/mems.controller.js
touch $PROJECT_NAME/server/modules/mems/mems.service.js

touch $PROJECT_NAME/server/db/models/User.js
touch $PROJECT_NAME/server/db/models/Recipe.js
touch $PROJECT_NAME/server/db/models/MachineMetric.js
touch $PROJECT_NAME/server/db/db.js

touch $PROJECT_NAME/server/app.js
touch $PROJECT_NAME/server/package.json

# ===== CLIENT-SHELL (React - Login + Nav เท่านั้น) =====
mkdir -p $PROJECT_NAME/client-shell/src/pages
mkdir -p $PROJECT_NAME/client-shell/src/config

touch $PROJECT_NAME/client-shell/src/pages/Login.jsx
touch $PROJECT_NAME/client-shell/src/config/navigation.js
touch $PROJECT_NAME/client-shell/src/App.jsx
touch $PROJECT_NAME/client-shell/src/main.jsx
touch $PROJECT_NAME/client-shell/package.json

# ===== CLIENT-MEMS (React - MEMS dashboard เต็มรูปแบบ) =====
mkdir -p $PROJECT_NAME/client-mems/src/pages
mkdir -p $PROJECT_NAME/client-mems/src/components

touch $PROJECT_NAME/client-mems/src/pages/MemsDashboard.jsx
touch $PROJECT_NAME/client-mems/src/App.jsx
touch $PROJECT_NAME/client-mems/src/main.jsx
touch $PROJECT_NAME/client-mems/package.json

# ===== PUBLIC-RATS (Vanilla JS) =====
mkdir -p $PROJECT_NAME/public-rats

touch $PROJECT_NAME/public-rats/index.html
touch $PROJECT_NAME/public-rats/style.css
touch $PROJECT_NAME/public-rats/app.js

echo ""
echo "✅ สร้างโครงสร้างโปรเจค '$PROJECT_NAME' เรียบร้อยแล้ว"
echo ""
find $PROJECT_NAME -print | sed -e "s;[^/]*/;  ;g;s;  \([^ ]\); \1;"