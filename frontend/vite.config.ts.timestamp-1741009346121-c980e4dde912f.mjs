// vite.config.ts
import react from "file:///E:/thewhitelabelshow/qanduwhitelabel/frontend/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@4.4.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import "file:///E:/thewhitelabelshow/qanduwhitelabel/frontend/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/config.js";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "file:///E:/thewhitelabelshow/qanduwhitelabel/frontend/node_modules/.pnpm/vite@4.4.5_@types+node@20.6.2/node_modules/vite/dist/node/index.js";
import injectHTML from "file:///E:/thewhitelabelshow/qanduwhitelabel/frontend/node_modules/.pnpm/vite-plugin-html-inject@1.1.2/node_modules/vite-plugin-html-inject/dist/index.mjs";
import tsConfigPaths from "file:///E:/thewhitelabelshow/qanduwhitelabel/frontend/node_modules/.pnpm/vite-tsconfig-paths@4.2.2_typescript@5.2.2_vite@4.4.5/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\thewhitelabelshow\\qanduwhitelabel\\frontend";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx0aGV3aGl0ZWxhYmVsc2hvd1xcXFxxYW5kdXdoaXRlbGFiZWxcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHRoZXdoaXRlbGFiZWxzaG93XFxcXHFhbmR1d2hpdGVsYWJlbFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovdGhld2hpdGVsYWJlbHNob3cvcWFuZHV3aGl0ZWxhYmVsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IFwiZG90ZW52L2NvbmZpZ1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBpbmplY3RIVE1MIGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sLWluamVjdFwiO1xuaW1wb3J0IHRzQ29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxudHlwZSBFeHRlbnNpb24gPSB7XG5cdG5hbWU6IHN0cmluZztcblx0dmVyc2lvbjogc3RyaW5nO1xuXHRjb25maWc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufTtcblxuY29uc3QgbGlzdEV4dGVuc2lvbnMgPSAoKTogRXh0ZW5zaW9uW10gPT4ge1xuXHRpZiAocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHByb2Nlc3MuZW52LkRBVEFCVVRUT05fRVhURU5TSU9OUykgYXMgRXh0ZW5zaW9uW107XG5cdFx0fSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBEQVRBQlVUVE9OX0VYVEVOU0lPTlNcIiwgZXJyKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKTtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW107XG59O1xuXG5jb25zdCBleHRlbnNpb25zID0gbGlzdEV4dGVuc2lvbnMoKTtcblxuY29uc3QgYnVpbGRWYXJpYWJsZXMgPSAoKSA9PiB7XG5cdGNvbnN0IGFwcElkID0gcHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9QUk9KRUNUX0lEO1xuXG5cdGNvbnN0IGRlZmluZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFx0X19BUFBfSURfXzogSlNPTi5zdHJpbmdpZnkoYXBwSWQpLFxuXHRcdF9fQVBJX1BBVEhfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUElfVVJMX186IEpTT04uc3RyaW5naWZ5KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCIpLFxuXHRcdF9fV1NfQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcIndzOi8vbG9jYWxob3N0OjgwMDBcIiksXG5cdFx0X19BUFBfQkFTRV9QQVRIX186IEpTT04uc3RyaW5naWZ5KFwiL1wiKSxcblx0XHRfX0FQUF9USVRMRV9fOiBKU09OLnN0cmluZ2lmeShcIkRhdGFidXR0b25cIiksXG5cdFx0X19BUFBfRkFWSUNPTl9MSUdIVF9fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWxpZ2h0LnN2Z1wiKSxcblx0XHRfX0FQUF9GQVZJQ09OX0RBUktfXzogSlNPTi5zdHJpbmdpZnkoXCIvZmF2aWNvbi1kYXJrLnN2Z1wiKSxcblx0XHRfX0FQUF9ERVBMT1lfVVNFUk5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfREVQTE9ZX0FQUE5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfREVQTE9ZX0NVU1RPTV9ET01BSU5fXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcblx0fTtcblxuXHRyZXR1cm4gZGVmaW5lcztcbn07XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBkZWZpbmU6IGJ1aWxkVmFyaWFibGVzKCksXG4gICAgcGx1Z2luczogW3JlYWN0KCksIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4oKSwgdHNDb25maWdQYXRocygpLCBpbmplY3RIVE1MKCldLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgXCIvcm91dGVzXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDAwXCIsXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiL2F1dGgvbG9naW5cIjoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjUxNzdcIixcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gXCIvbG9naW5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnL3YyJzoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vanMucHV0ZXIuY29tJyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigncHJveHkgZXJyb3InLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIFJlcXVlc3QgdG8gdGhlIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vanMucHV0ZXIuY29tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1JlZmVyZXInLCAnaHR0cHM6Ly9qcy5wdXRlci5jb20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignSG9zdCcsICdqcy5wdXRlci5jb20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0Nvb2tpZScsIHJlcS5oZWFkZXJzLmNvb2tpZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIFJlc3BvbnNlIGZyb20gdGhlIFRhcmdldDonLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiddID0gcmVxLmhlYWRlcnMub3JpZ2luIHx8ICdodHRwOi8vbG9jYWxob3N0OjUxNzcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctY3JlZGVudGlhbHMnXSA9ICd0cnVlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnXSA9ICdHRVQsSEVBRCxQVVQsUEFUQ0gsUE9TVCxERUxFVEUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctaGVhZGVycyddID0gJ0NvbnRlbnQtVHlwZSxBdXRob3JpemF0aW9uLENvb2tpZSxYLVJlcXVlc3RlZC1XaXRoLFgtUHV0ZXItVG9rZW4nO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvYXBpL3B1dGVyJzoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vYXBpLnB1dGVyLmNvbScsXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1B1dGVyIHByb3h5IGVycm9yOicsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHByb3BlciBvcmlnaW4gYW5kIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vYXBpLnB1dGVyLmNvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdSZWZlcmVyJywgJ2h0dHBzOi8vYXBpLnB1dGVyLmNvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdIb3N0JywgJ2FwaS5wdXRlci5jb20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IHJlcS5oZWFkZXJzWyd4LXB1dGVyLXRva2VuJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1gtUHV0ZXItVG9rZW4nLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXEuc2V0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgYEJlYXJlciAke3Rva2VufWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMb2cgcmVxdWVzdCBmb3IgZGVidWdnaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VuZGluZyBQdXRlciBBUEkgUmVxdWVzdDonLCByZXEubWV0aG9kLCByZXEudXJsLCB0b2tlbiA/ICcod2l0aCB0b2tlbiknIDogJyhubyB0b2tlbiknKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgcHJvcGVyIENPUlMgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJ10gPSAnKic7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcy5oZWFkZXJzWydhY2Nlc3MtY29udHJvbC1hbGxvdy1tZXRob2RzJ10gPSAnR0VULEhFQUQsUFVULFBBVENILFBPU1QsREVMRVRFJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsQXV0aG9yaXphdGlvbixYLVB1dGVyLVRva2VuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWV4cG9zZS1oZWFkZXJzJ10gPSAnQ29udGVudC1UeXBlLEF1dGhvcml6YXRpb24sWC1QdXRlci1Ub2tlbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBQdXRlciBBUEkgUmVzcG9uc2U6JywgcHJveHlSZXMuc3RhdHVzQ29kZSwgcmVxLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaVxcL3B1dGVyLywgJycpLFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVSxPQUFPLFdBQVc7QUFDblYsT0FBTztBQUNQLE9BQU8sVUFBVTtBQUNqQixTQUFTLGNBQWMsOEJBQThCO0FBQ3JELE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBTDFCLElBQU0sbUNBQW1DO0FBYXpDLElBQU0saUJBQWlCLE1BQW1CO0FBQ3pDLE1BQUksUUFBUSxJQUFJLHVCQUF1QjtBQUN0QyxRQUFJO0FBQ0gsYUFBTyxLQUFLLE1BQU0sUUFBUSxJQUFJLHFCQUFxQjtBQUFBLElBQ3BELFNBQVMsS0FBYztBQUN0QixjQUFRLE1BQU0sdUNBQXVDLEdBQUc7QUFDeEQsY0FBUSxNQUFNLFFBQVEsSUFBSSxxQkFBcUI7QUFDL0MsYUFBTyxDQUFDO0FBQUEsSUFDVDtBQUFBLEVBQ0Q7QUFFQSxTQUFPLENBQUM7QUFDVDtBQUVBLElBQU0sYUFBYSxlQUFlO0FBRWxDLElBQU0saUJBQWlCLE1BQU07QUFDNUIsUUFBTSxRQUFRLFFBQVEsSUFBSTtBQUUxQixRQUFNLFVBQWtDO0FBQUEsSUFDdkMsWUFBWSxLQUFLLFVBQVUsS0FBSztBQUFBLElBQ2hDLGNBQWMsS0FBSyxVQUFVLEVBQUU7QUFBQSxJQUMvQixhQUFhLEtBQUssVUFBVSx1QkFBdUI7QUFBQSxJQUNuRCxnQkFBZ0IsS0FBSyxVQUFVLHFCQUFxQjtBQUFBLElBQ3BELG1CQUFtQixLQUFLLFVBQVUsR0FBRztBQUFBLElBQ3JDLGVBQWUsS0FBSyxVQUFVLFlBQVk7QUFBQSxJQUMxQyx1QkFBdUIsS0FBSyxVQUFVLG9CQUFvQjtBQUFBLElBQzFELHNCQUFzQixLQUFLLFVBQVUsbUJBQW1CO0FBQUEsSUFDeEQseUJBQXlCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDMUMsd0JBQXdCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDekMsOEJBQThCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDL0MsaUJBQWlCLEtBQUssVUFBVSxRQUFRLElBQUksbUJBQW1CO0FBQUEsRUFDaEU7QUFFQSxTQUFPO0FBQ1I7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixRQUFRLGVBQWU7QUFBQSxFQUN2QixTQUFTLENBQUMsTUFBTSxHQUFHLHVCQUF1QixHQUFHLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFBQSxFQUMxRSxRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxXQUFXO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDbEI7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBUztBQUFBLE1BQ3ZCO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDSCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsUUFDSixXQUFXLENBQUMsT0FBTyxhQUFhO0FBQzVCLGdCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQ25DLG9CQUFRLE1BQU0sZUFBZSxHQUFHO0FBQUEsVUFDcEMsQ0FBQztBQUNELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzFDLG9CQUFRLElBQUksa0NBQWtDLElBQUksUUFBUSxJQUFJLEdBQUc7QUFDakUscUJBQVMsVUFBVSxVQUFVLHNCQUFzQjtBQUNuRCxxQkFBUyxVQUFVLFdBQVcsc0JBQXNCO0FBQ3BELHFCQUFTLFVBQVUsUUFBUSxjQUFjO0FBQ3pDLGdCQUFJLElBQUksUUFBUSxRQUFRO0FBQ3BCLHVCQUFTLFVBQVUsVUFBVSxJQUFJLFFBQVEsTUFBTTtBQUFBLFlBQ25EO0FBQUEsVUFDSixDQUFDO0FBQ0QsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVM7QUFDMUMsb0JBQVEsSUFBSSxzQ0FBc0MsU0FBUyxZQUFZLElBQUksR0FBRztBQUM5RSxxQkFBUyxRQUFRLDZCQUE2QixJQUFJLElBQUksUUFBUSxVQUFVO0FBQ3hFLHFCQUFTLFFBQVEsa0NBQWtDLElBQUk7QUFDdkQscUJBQVMsUUFBUSw4QkFBOEIsSUFBSTtBQUNuRCxxQkFBUyxRQUFRLDhCQUE4QixJQUFJO0FBQUEsVUFDdkQsQ0FBQztBQUFBLFFBQ0w7QUFBQSxNQUNKO0FBQUEsTUFDQSxjQUFjO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsUUFDSixXQUFXLENBQUMsT0FBTyxhQUFhO0FBQzVCLGdCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQ25DLG9CQUFRLE1BQU0sc0JBQXNCLEdBQUc7QUFBQSxVQUMzQyxDQUFDO0FBQ0QsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVM7QUFFMUMscUJBQVMsVUFBVSxVQUFVLHVCQUF1QjtBQUNwRCxxQkFBUyxVQUFVLFdBQVcsdUJBQXVCO0FBQ3JELHFCQUFTLFVBQVUsUUFBUSxlQUFlO0FBRzFDLGtCQUFNLFFBQVEsSUFBSSxRQUFRLGVBQWU7QUFDekMsZ0JBQUksT0FBTztBQUNQLHVCQUFTLFVBQVUsaUJBQWlCLEtBQUs7QUFDekMsdUJBQVMsVUFBVSxpQkFBaUIsVUFBVSxLQUFLLEVBQUU7QUFBQSxZQUN6RDtBQUdBLG9CQUFRLElBQUksOEJBQThCLElBQUksUUFBUSxJQUFJLEtBQUssUUFBUSxpQkFBaUIsWUFBWTtBQUFBLFVBQ3hHLENBQUM7QUFDRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUUxQyxxQkFBUyxRQUFRLDZCQUE2QixJQUFJO0FBQ2xELHFCQUFTLFFBQVEsOEJBQThCLElBQUk7QUFDbkQscUJBQVMsUUFBUSw4QkFBOEIsSUFBSTtBQUNuRCxxQkFBUyxRQUFRLCtCQUErQixJQUFJO0FBRXBELG9CQUFRLElBQUksZ0NBQWdDLFNBQVMsWUFBWSxJQUFJLEdBQUc7QUFBQSxVQUM1RSxDQUFDO0FBQUEsUUFDTDtBQUFBLFFBQ0EsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsaUJBQWlCLEVBQUU7QUFBQSxNQUN2RDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDeEM7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
