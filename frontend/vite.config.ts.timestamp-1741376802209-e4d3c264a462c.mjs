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
    proxy: {
      "/routes": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxxYW5kdXdoaXRlbGFiZWxcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHFhbmR1d2hpdGVsYWJlbFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovcWFuZHV3aGl0ZWxhYmVsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgXCJkb3RlbnYvY29uZmlnXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGluamVjdEhUTUwgZnJvbSBcInZpdGUtcGx1Z2luLWh0bWwtaW5qZWN0XCI7XHJcbmltcG9ydCB0c0NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XHJcblxyXG50eXBlIEV4dGVuc2lvbiA9IHtcclxuXHRuYW1lOiBzdHJpbmc7XHJcblx0dmVyc2lvbjogc3RyaW5nO1xyXG5cdGNvbmZpZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XHJcbn07XHJcblxyXG5jb25zdCBsaXN0RXh0ZW5zaW9ucyA9ICgpOiBFeHRlbnNpb25bXSA9PiB7XHJcblx0aWYgKHByb2Nlc3MuZW52LkRBVEFCVVRUT05fRVhURU5TSU9OUykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKSBhcyBFeHRlbnNpb25bXTtcclxuXHRcdH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBEQVRBQlVUVE9OX0VYVEVOU0lPTlNcIiwgZXJyKTtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihwcm9jZXNzLmVudi5EQVRBQlVUVE9OX0VYVEVOU0lPTlMpO1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW107XHJcbn07XHJcblxyXG5jb25zdCBleHRlbnNpb25zID0gbGlzdEV4dGVuc2lvbnMoKTtcclxuXHJcbmNvbnN0IGJ1aWxkVmFyaWFibGVzID0gKCkgPT4ge1xyXG5cdGNvbnN0IGFwcElkID0gcHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9QUk9KRUNUX0lEO1xyXG5cclxuXHRjb25zdCBkZWZpbmVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xyXG5cdFx0X19BUFBfSURfXzogSlNPTi5zdHJpbmdpZnkoYXBwSWQpLFxyXG5cdFx0X19BUElfUEFUSF9fOiBKU09OLnN0cmluZ2lmeShcIlwiKSxcclxuXHRcdF9fQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKSxcclxuXHRcdF9fV1NfQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcIndzOi8vbG9jYWxob3N0OjgwMDBcIiksXHJcblx0XHRfX0FQUF9CQVNFX1BBVEhfXzogSlNPTi5zdHJpbmdpZnkoXCIvXCIpLFxyXG5cdFx0X19BUFBfVElUTEVfXzogSlNPTi5zdHJpbmdpZnkoXCJEYXRhYnV0dG9uXCIpLFxyXG5cdFx0X19BUFBfRkFWSUNPTl9MSUdIVF9fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWxpZ2h0LnN2Z1wiKSxcclxuXHRcdF9fQVBQX0ZBVklDT05fREFSS19fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWRhcmsuc3ZnXCIpLFxyXG5cdFx0X19BUFBfREVQTE9ZX1VTRVJOQU1FX186IEpTT04uc3RyaW5naWZ5KFwiXCIpLFxyXG5cdFx0X19BUFBfREVQTE9ZX0FQUE5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXHJcblx0XHRfX0FQUF9ERVBMT1lfQ1VTVE9NX0RPTUFJTl9fOiBKU09OLnN0cmluZ2lmeShcIlwiKSxcclxuXHRcdF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbiksXHJcblx0fTtcclxuXHJcblx0cmV0dXJuIGRlZmluZXM7XHJcbn07XHJcblxyXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIGRlZmluZTogYnVpbGRWYXJpYWJsZXMoKSxcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luKCksIHRzQ29uZmlnUGF0aHMoKSwgaW5qZWN0SFRNTCgpXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAgIFwiL3JvdXRlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDAwXCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiL2F1dGgvbG9naW5cIjoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTE3N1wiLFxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvdXBsb2Fkcyc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvYXBpL3VwbG9hZCc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvdjInOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2pzLnB1dGVyLmNvbScsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3Byb3h5IGVycm9yJywgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBSZXF1ZXN0IHRvIHRoZSBUYXJnZXQ6JywgcmVxLm1ldGhvZCwgcmVxLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vanMucHV0ZXIuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignUmVmZXJlcicsICdodHRwczovL2pzLnB1dGVyLmNvbScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0hvc3QnLCAnanMucHV0ZXIuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5jb29raWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQ29va2llJywgcmVxLmhlYWRlcnMuY29va2llKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBSZXNwb25zZSBmcm9tIHRoZSBUYXJnZXQ6JywgcHJveHlSZXMuc3RhdHVzQ29kZSwgcmVxLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiddID0gcmVxLmhlYWRlcnMub3JpZ2luIHx8ICdodHRwOi8vbG9jYWxob3N0OjUxNzcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1jcmVkZW50aWFscyddID0gJ3RydWUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1tZXRob2RzJ10gPSAnR0VULEhFQUQsUFVULFBBVENILFBPU1QsREVMRVRFJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctaGVhZGVycyddID0gJ0NvbnRlbnQtVHlwZSxBdXRob3JpemF0aW9uLENvb2tpZSxYLVJlcXVlc3RlZC1XaXRoLFgtUHV0ZXItVG9rZW4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy9hcGkvcHV0ZXInOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FwaS5wdXRlci5jb20nLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHdzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdQdXRlciBwcm94eSBlcnJvcjonLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBwcm9wZXIgb3JpZ2luIGFuZCBoZWFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vYXBpLnB1dGVyLmNvbScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1JlZmVyZXInLCAnaHR0cHM6Ly9hcGkucHV0ZXIuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignSG9zdCcsICdhcGkucHV0ZXIuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSByZXEuaGVhZGVyc1sneC1wdXRlci10b2tlbiddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignWC1QdXRlci1Ub2tlbicsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHt0b2tlbn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTG9nIHJlcXVlc3QgZm9yIGRlYnVnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBQdXRlciBBUEkgUmVxdWVzdDonLCByZXEubWV0aG9kLCByZXEudXJsLCB0b2tlbiA/ICcod2l0aCB0b2tlbiknIDogJyhubyB0b2tlbiknKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgcHJvcGVyIENPUlMgaGVhZGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1vcmlnaW4nXSA9ICcqJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctbWV0aG9kcyddID0gJ0dFVCxIRUFELFBVVCxQQVRDSCxQT1NULERFTEVURSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvbixYLVB1dGVyLVRva2VuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtZXhwb3NlLWhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvbixYLVB1dGVyLVRva2VuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBQdXRlciBBUEkgUmVzcG9uc2U6JywgcHJveHlSZXMuc3RhdHVzQ29kZSwgcmVxLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaVxcL3B1dGVyLywgJycpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL2FwaSc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tJyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnL3YxJyksXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSBwcm94eSBlcnJvcjonLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvZ2VtaW5pJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2dlbWluaS8sICcnKSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignR2VtaW5pIHByb3h5IGVycm9yOicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdPcmlnaW4nLCAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdSZWZlcmVyJywgJ2h0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVzJywgKHByb3h5UmVzLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJ10gPSAnKic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnXSA9ICdHRVQsSEVBRCxQVVQsUEFUQ0gsUE9TVCxERUxFVEUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJ10gPSAnQ29udGVudC1UeXBlLEF1dGhvcml6YXRpb24nO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL29wZW5haSc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tL3YxYmV0YS9vcGVuYWknLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL29wZW5haS8sICcnKSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignT3BlbkFJIHByb3h5IGVycm9yOicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdPcmlnaW4nLCAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlLEF1dGhvcml6YXRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCxQT1NULFBVVCxERUxFVEUsT1BUSU9OUycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL3YxYmV0YSc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tJyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQVBJIHByb3h5IGVycm9yOicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdPcmlnaW4nLCAnaHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdSZWZlcmVyJywgJ2h0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVzJywgKHByb3h5UmVzLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJ10gPSAnKic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnXSA9ICdHRVQsSEVBRCxQVVQsUEFUQ0gsUE9TVCxERUxFVEUnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJ10gPSAnQ29udGVudC1UeXBlLEF1dGhvcml6YXRpb24nO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0pO1xy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
