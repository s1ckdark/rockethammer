```
.
├── README.md
├── frontend
│   ├── README.md
│   ├── env.template
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── favicon.png
│   │   ├── img
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── req.cnf
│   └── src
│       ├── App.css
│       ├── App.css.map
│       ├── App.js
│       ├── App.scss
│       ├── App.test.js
│       ├── components
│       ├── dist
│       ├── img
│       ├── index.css
│       ├── index.css.map
│       ├── index.js
│       ├── index.scss
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── serviceWorker.js
│       ├── services
│       └── setupTests.js
├── nohup.out
└── spring-boot-security-jwt-mongodb-0.2.7-SNAPSHOT.jar
```

# Clone
>git clone https://github.com/pdev-gd/rockethammer-admin.git

# Frontend

> cd rockethammer-admin/frontend
> cp env.template .env
> vim .env
```
REACT_APP_API='/api'
REACT_APP_PROMETHEUS={url}
REACT_APP_GRAFANA={url}
REACT_APP_KAFAKUI={url}
```
```
> npm install
> npm run build
```
---

# Backend
## JAVA JDK 1.8
```
> cd rockethammer-admin
> nohup java -jar -Dspring.config.location={/path/to/properties} 
spring-boot-security-jwt-mongodb-0.2.7-SNAPSHOT.jar &
```