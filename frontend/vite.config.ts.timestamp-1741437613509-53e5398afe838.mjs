// vite.config.ts
import react from "file:///E:/qanduwhitelabel/frontend/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@4.4.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import "file:///E:/qanduwhitelabel/frontend/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/config.js";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "file:///E:/qanduwhitelabel/frontend/node_modules/.pnpm/vite@4.4.5_@types+node@20.6.2/node_modules/vite/dist/node/index.js";
import injectHTML from "file:///E:/qanduwhitelabel/frontend/node_modules/.pnpm/vite-plugin-html-inject@1.1.2/node_modules/vite-plugin-html-inject/dist/index.mjs";
import tsConfigPaths from "file:///E:/qanduwhitelabel/frontend/node_modules/.pnpm/vite-tsconfig-paths@4.2.2_typescript@5.2.2_vite@4.4.5/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\qanduwhitelabel\\frontend";
var listExtensions = () => {
  if (process.env.DATABUTTON_EXTENSIONS) {
    try {
      return JSON.parse(process.env.DATABUTTON_EXTENSIONS);
    } catch (err) {
      console.error("Error parsing DATABUTTON_EXTENSIONS", err);
      console.error(process.env.DATABUTTON_EXTENSIONS);
      return [];
    }
  }
  return [];
};
var extensions = listExtensions();
var buildVariables = () => {
  const appId = process.env.DATABUTTON_PROJECT_ID;
  const defines = {
    __APP_ID__: JSON.stringify(appId),
    __API_PATH__: JSON.stringify(""),
    __API_URL__: JSON.stringify("http://localhost:8000"),
    __WS_API_URL__: JSON.stringify("ws://localhost:8000"),
    __APP_BASE_PATH__: JSON.stringify("/"),
    __APP_TITLE__: JSON.stringify("Databutton"),
    __APP_FAVICON_LIGHT__: JSON.stringify("/favicon-light.svg"),
    __APP_FAVICON_DARK__: JSON.stringify("/favicon-dark.svg"),
    __APP_DEPLOY_USERNAME__: JSON.stringify(""),
    __APP_DEPLOY_APPNAME__: JSON.stringify(""),
    __APP_DEPLOY_CUSTOM_DOMAIN__: JSON.stringify(""),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  };
  return defines;
};
var vite_config_default = defineConfig({
  define: buildVariables(),
  plugins: [react(), splitVendorChunkPlugin(), tsConfigPaths(), injectHTML()],
  server: {
    port: 5174,
    proxy: {
      "/routes": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("Backend proxy error:", err);
          });
        }
      },
      "/auth/login": {
        target: "http://localhost:5177",
        rewrite: (path2) => "/login"
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true
      },
      "/api/upload": {
        target: "http://localhost:5000",
        changeOrigin: true
      },
      "/v2": {
        target: "https://js.puter.com",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
            proxyReq.setHeader("Origin", "https://js.puter.com");
            proxyReq.setHeader("Referer", "https://js.puter.com");
            proxyReq.setHeader("Host", "js.puter.com");
            if (req.headers.cookie) {
              proxyReq.setHeader("Cookie", req.headers.cookie);
            }
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
            proxyRes.headers["access-control-allow-origin"] = req.headers.origin || "http://localhost:5177";
            proxyRes.headers["access-control-allow-credentials"] = "true";
            proxyRes.headers["access-control-allow-methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE";
            proxyRes.headers["access-control-allow-headers"] = "Content-Type,Authorization,Cookie,X-Requested-With,X-Puter-Token";
          });
        }
      },
      "/api/puter": {
        target: "https://api.puter.com",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("Puter proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader("Origin", "https://api.puter.com");
            proxyReq.setHeader("Referer", "https://api.puter.com");
            proxyReq.setHeader("Host", "api.puter.com");
            const token = req.headers["x-puter-token"];
            if (token) {
              proxyReq.setHeader("X-Puter-Token", token);
              proxyReq.setHeader("Authorization", `Bearer ${token}`);
            }
            console.log("Sending Puter API Request:", req.method, req.url, token ? "(with token)" : "(no token)");
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE";
            proxyRes.headers["access-control-allow-headers"] = "Content-Type,Authorization,X-Puter-Token";
            proxyRes.headers["access-control-expose-headers"] = "Content-Type,Authorization,X-Puter-Token";
            console.log("Received Puter API Response:", proxyRes.statusCode, req.url);
          });
        },
        rewrite: (path2) => path2.replace(/^\/api\/puter/, "")
      },
      "/api": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "/v1"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("API proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader("Origin", "https://generativelanguage.googleapis.com");
          });
        }
      },
      "/gemini": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/gemini/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("Gemini proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader("Origin", "https://generativelanguage.googleapis.com");
            proxyReq.setHeader("Referer", "https://generativelanguage.googleapis.com");
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE";
            proxyRes.headers["access-control-allow-headers"] = "Content-Type,Authorization";
          });
        }
      },
      "/openai": {
        target: "https://generativelanguage.googleapis.com/v1beta/openai",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/openai/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("OpenAI proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader("Origin", "https://generativelanguage.googleapis.com");
            proxyReq.setHeader("Access-Control-Allow-Origin", "*");
            proxyReq.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
            proxyReq.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
          });
        }
      },
      "/v1beta": {
        target: "https://generativelanguage.googleapis.com",
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("API proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader("Origin", "https://generativelanguage.googleapis.com");
            proxyReq.setHeader("Referer", "https://generativelanguage.googleapis.com");
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE";
            proxyRes.headers["access-control-allow-headers"] = "Content-Type,Authorization";
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxxYW5kdXdoaXRlbGFiZWxcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHFhbmR1d2hpdGVsYWJlbFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovcWFuZHV3aGl0ZWxhYmVsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgXCJkb3RlbnYvY29uZmlnXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGluamVjdEhUTUwgZnJvbSBcInZpdGUtcGx1Z2luLWh0bWwtaW5qZWN0XCI7XHJcbmltcG9ydCB0c0NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XHJcblxyXG50eXBlIEV4dGVuc2lvbiA9IHtcclxuXHRuYW1lOiBzdHJpbmc7XHJcblx0dmVyc2lvbjogc3RyaW5nO1xyXG5cdGNvbmZpZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XHJcbn07XHJcblxyXG5jb25zdCBsaXN0RXh0ZW5zaW9ucyA9ICgpOiBFeHRlbnNpb25bXSA9PiB7XHJcblx0aWYgKHByb2Nlc3MuZW52LkRBVEFCVVRUT05fRVhURU5TSU9OUykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKSBhcyBFeHRlbnNpb25bXTtcclxuXHRcdH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBEQVRBQlVUVE9OX0VYVEVOU0lPTlNcIiwgZXJyKTtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihwcm9jZXNzLmVudi5EQVRBQlVUVE9OX0VYVEVOU0lPTlMpO1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW107XHJcbn07XHJcblxyXG5jb25zdCBleHRlbnNpb25zID0gbGlzdEV4dGVuc2lvbnMoKTtcclxuXHJcbmNvbnN0IGJ1aWxkVmFyaWFibGVzID0gKCkgPT4ge1xyXG5cdGNvbnN0IGFwcElkID0gcHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9QUk9KRUNUX0lEO1xyXG5cclxuXHRjb25zdCBkZWZpbmVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xyXG5cdFx0X19BUFBfSURfXzogSlNPTi5zdHJpbmdpZnkoYXBwSWQpLFxyXG5cdFx0X19BUElfUEFUSF9fOiBKU09OLnN0cmluZ2lmeShcIlwiKSxcclxuXHRcdF9fQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKSxcclxuXHRcdF9fV1NfQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcIndzOi8vbG9jYWxob3N0OjgwMDBcIiksXHJcblx0XHRfX0FQUF9CQVNFX1BBVEhfXzogSlNPTi5zdHJpbmdpZnkoXCIvXCIpLFxyXG5cdFx0X19BUFBfVElUTEVfXzogSlNPTi5zdHJpbmdpZnkoXCJEYXRhYnV0dG9uXCIpLFxyXG5cdFx0X19BUFBfRkFWSUNPTl9MSUdIVF9fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWxpZ2h0LnN2Z1wiKSxcclxuXHRcdF9fQVBQX0ZBVklDT05fREFSS19fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWRhcmsuc3ZnXCIpLFxyXG5cdFx0X19BUFBfREVQTE9ZX1VTRVJOQU1FX186IEpTT04uc3RyaW5naWZ5KFwiXCIpLFxyXG5cdFx0X19BUFBfREVQTE9ZX0FQUE5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXHJcblx0XHRfX0FQUF9ERVBMT1lfQ1VTVE9NX0RPTUFJTl9fOiBKU09OLnN0cmluZ2lmeShcIlwiKSxcclxuXHRcdF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbiksXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIGRlZmluZXM7XHJcbn07XHJcblxyXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIGRlZmluZTogYnVpbGRWYXJpYWJsZXMoKSxcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luKCksIHRzQ29uZmlnUGF0aHMoKSwgaW5qZWN0SFRNTCgpXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHBvcnQ6IDUxNzQsXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgXCIvcm91dGVzXCI6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjgwODBcIixcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhY2tlbmQgcHJveHkgZXJyb3I6JywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIvYXV0aC9sb2dpblwiOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo1MTc3XCIsXHJcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gXCIvbG9naW5cIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy91cGxvYWRzJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy9hcGkvdXBsb2FkJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAwJyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy92Mic6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vanMucHV0ZXIuY29tJyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigncHJveHkgZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIFJlcXVlc3QgdG8gdGhlIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdPcmlnaW4nLCAnaHR0cHM6Ly9qcy5wdXRlci5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdSZWZlcmVyJywgJ2h0dHBzOi8vanMucHV0ZXIuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignSG9zdCcsICdqcy5wdXRlci5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5oZWFkZXJzLmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdDb29raWUnLCByZXEuaGVhZGVycy5jb29raWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVzJywgKHByb3h5UmVzLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIFJlc3BvbnNlIGZyb20gdGhlIFRhcmdldDonLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJ10gPSByZXEuaGVhZGVycy5vcmlnaW4gfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3Nyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWNyZWRlbnRpYWxzJ10gPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnXSA9ICdHRVQsSEVBRCxQVVQsUEFUQ0gsUE9TVCxERUxFVEUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJ10gPSAnQ29udGVudC1UeXBlLEF1dGhvcml6YXRpb24sQ29va2llLFgtUmVxdWVzdGVkLVdpdGgsWC1QdXRlci1Ub2tlbic7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL2FwaS9wdXRlcic6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vYXBpLnB1dGVyLmNvbScsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1B1dGVyIHByb3h5IGVycm9yOicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHByb3BlciBvcmlnaW4gYW5kIGhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdPcmlnaW4nLCAnaHR0cHM6Ly9hcGkucHV0ZXIuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignUmVmZXJlcicsICdodHRwczovL2FwaS5wdXRlci5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdIb3N0JywgJ2FwaS5wdXRlci5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSB0b2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzWyd4LXB1dGVyLXRva2VuJ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdYLVB1dGVyLVRva2VuJywgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgYEJlYXJlciAke3Rva2VufWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMb2cgcmVxdWVzdCBmb3IgZGVidWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIFB1dGVyIEFQSSBSZXF1ZXN0OicsIHJlcS5tZXRob2QsIHJlcS51cmwsIHRva2VuID8gJyh3aXRoIHRva2VuKScgOiAnKG5vIHRva2VuKScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBwcm9wZXIgQ09SUyBoZWFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiddID0gJyonO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1tZXRob2RzJ10gPSAnR0VULEhFQUQsUFVULFBBVENILFBPU1QsREVMRVRFJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctaGVhZGVycyddID0gJ0NvbnRlbnQtVHlwZSxBdXRob3JpemF0aW9uLFgtUHV0ZXItVG9rZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1leHBvc2UtaGVhZGVycyddID0gJ0NvbnRlbnQtVHlwZSxBdXRob3JpemF0aW9uLFgtUHV0ZXItVG9rZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIFB1dGVyIEFQSSBSZXNwb25zZTonLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvcHV0ZXIvLCAnJyksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcvdjEnKSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQVBJIHByb3h5IGVycm9yOicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdPcmlnaW4nLCAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy9nZW1pbmknOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2dlbmVyYXRpdmVsYW5ndWFnZS5nb29nbGVhcGlzLmNvbScsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZ2VtaW5pLywgJycpLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdHZW1pbmkgcHJveHkgZXJyb3I6JywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ09yaWdpbicsICdodHRwczovL2dlbmVyYXRpdmVsYW5ndWFnZS5nb29nbGVhcGlzLmNvbScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1JlZmVyZXInLCAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1vcmlnaW4nXSA9ICcqJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctbWV0aG9kcyddID0gJ0dFVCxIRUFELFBVVCxQQVRDSCxQT1NULERFTEVURSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvbic7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvb3BlbmFpJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20vdjFiZXRhL29wZW5haScsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvb3BlbmFpLywgJycpLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdPcGVuQUkgcHJveHkgZXJyb3I6JywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ09yaWdpbicsICdodHRwczovL2dlbmVyYXRpdmVsYW5ndWFnZS5nb29nbGVhcGlzLmNvbScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnLCAnR0VULFBPU1QsUFVULERFTEVURSxPUFRJT05TJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvdjFiZXRhJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBUEkgcHJveHkgZXJyb3I6JywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ09yaWdpbicsICdodHRwczovL2dlbmVyYXRpdmVsYW5ndWFnZS5nb29nbGVhcGlzLmNvbScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1JlZmVyZXInLCAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1vcmlnaW4nXSA9ICcqJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctbWV0aG9kcyddID0gJ0dFVCxIRUFELFBVVCxQQVRDSCxQT1NULERFTEVURSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvbic7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsT0FBTyxXQUFXO0FBQzNSLE9BQU87QUFDUCxPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjLDhCQUE4QjtBQUNyRCxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUwxQixJQUFNLG1DQUFtQztBQWF6QyxJQUFNLGlCQUFpQixNQUFtQjtBQUN6QyxNQUFJLFFBQVEsSUFBSSx1QkFBdUI7QUFDdEMsUUFBSTtBQUNILGFBQU8sS0FBSyxNQUFNLFFBQVEsSUFBSSxxQkFBcUI7QUFBQSxJQUNwRCxTQUFTLEtBQWM7QUFDdEIsY0FBUSxNQUFNLHVDQUF1QyxHQUFHO0FBQ3hELGNBQVEsTUFBTSxRQUFRLElBQUkscUJBQXFCO0FBQy9DLGFBQU8sQ0FBQztBQUFBLElBQ1Q7QUFBQSxFQUNEO0FBRUEsU0FBTyxDQUFDO0FBQ1Q7QUFFQSxJQUFNLGFBQWEsZUFBZTtBQUVsQyxJQUFNLGlCQUFpQixNQUFNO0FBQzVCLFFBQU0sUUFBUSxRQUFRLElBQUk7QUFFMUIsUUFBTSxVQUFrQztBQUFBLElBQ3ZDLFlBQVksS0FBSyxVQUFVLEtBQUs7QUFBQSxJQUNoQyxjQUFjLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDL0IsYUFBYSxLQUFLLFVBQVUsdUJBQXVCO0FBQUEsSUFDbkQsZ0JBQWdCLEtBQUssVUFBVSxxQkFBcUI7QUFBQSxJQUNwRCxt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
