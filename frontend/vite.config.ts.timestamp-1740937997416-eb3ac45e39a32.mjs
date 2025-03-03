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
            if (req.headers.cookie) {
              proxyReq.setHeader("Cookie", req.headers.cookie);
            }
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
            proxyRes.headers["access-control-allow-origin"] = req.headers.origin || "http://localhost:5175";
            proxyRes.headers["access-control-allow-credentials"] = "true";
            proxyRes.headers["access-control-allow-methods"] = "GET,HEAD,PUT,PATCH,POST,DELETE";
            proxyRes.headers["access-control-allow-headers"] = "Content-Type,Authorization,Cookie,X-Requested-With";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx0aGV3aGl0ZWxhYmVsc2hvd1xcXFxxYW5kdXdoaXRlbGFiZWxcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHRoZXdoaXRlbGFiZWxzaG93XFxcXHFhbmR1d2hpdGVsYWJlbFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovdGhld2hpdGVsYWJlbHNob3cvcWFuZHV3aGl0ZWxhYmVsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IFwiZG90ZW52L2NvbmZpZ1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBpbmplY3RIVE1MIGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sLWluamVjdFwiO1xuaW1wb3J0IHRzQ29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxudHlwZSBFeHRlbnNpb24gPSB7XG5cdG5hbWU6IHN0cmluZztcblx0dmVyc2lvbjogc3RyaW5nO1xuXHRjb25maWc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufTtcblxuY29uc3QgbGlzdEV4dGVuc2lvbnMgPSAoKTogRXh0ZW5zaW9uW10gPT4ge1xuXHRpZiAocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHByb2Nlc3MuZW52LkRBVEFCVVRUT05fRVhURU5TSU9OUykgYXMgRXh0ZW5zaW9uW107XG5cdFx0fSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBEQVRBQlVUVE9OX0VYVEVOU0lPTlNcIiwgZXJyKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKTtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW107XG59O1xuXG5jb25zdCBleHRlbnNpb25zID0gbGlzdEV4dGVuc2lvbnMoKTtcblxuY29uc3QgYnVpbGRWYXJpYWJsZXMgPSAoKSA9PiB7XG5cdGNvbnN0IGFwcElkID0gcHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9QUk9KRUNUX0lEO1xuXG5cdGNvbnN0IGRlZmluZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFx0X19BUFBfSURfXzogSlNPTi5zdHJpbmdpZnkoYXBwSWQpLFxuXHRcdF9fQVBJX1BBVEhfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUElfVVJMX186IEpTT04uc3RyaW5naWZ5KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCIpLFxuXHRcdF9fV1NfQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcIndzOi8vbG9jYWxob3N0OjgwMDBcIiksXG5cdFx0X19BUFBfQkFTRV9QQVRIX186IEpTT04uc3RyaW5naWZ5KFwiL1wiKSxcblx0XHRfX0FQUF9USVRMRV9fOiBKU09OLnN0cmluZ2lmeShcIkRhdGFidXR0b25cIiksXG5cdFx0X19BUFBfRkFWSUNPTl9MSUdIVF9fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWxpZ2h0LnN2Z1wiKSxcblx0XHRfX0FQUF9GQVZJQ09OX0RBUktfXzogSlNPTi5zdHJpbmdpZnkoXCIvZmF2aWNvbi1kYXJrLnN2Z1wiKSxcblx0XHRfX0FQUF9ERVBMT1lfVVNFUk5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfREVQTE9ZX0FQUE5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfREVQTE9ZX0NVU1RPTV9ET01BSU5fXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcblx0fTtcblxuXHRyZXR1cm4gZGVmaW5lcztcbn07XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBkZWZpbmU6IGJ1aWxkVmFyaWFibGVzKCksXG4gICAgcGx1Z2luczogW3JlYWN0KCksIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4oKSwgdHNDb25maWdQYXRocygpLCBpbmplY3RIVE1MKCldLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgXCIvcm91dGVzXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDAwXCIsXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiL2F1dGgvbG9naW5cIjoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjUxNzdcIixcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gXCIvbG9naW5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnL3YyJzoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vanMucHV0ZXIuY29tJyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigncHJveHkgZXJyb3InLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIFJlcXVlc3QgdG8gdGhlIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vanMucHV0ZXIuY29tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ1JlZmVyZXInLCAnaHR0cHM6Ly9qcy5wdXRlci5jb20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0Nvb2tpZScsIHJlcS5oZWFkZXJzLmNvb2tpZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIFJlc3BvbnNlIGZyb20gdGhlIFRhcmdldDonLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbiddID0gcmVxLmhlYWRlcnMub3JpZ2luIHx8ICdodHRwOi8vbG9jYWxob3N0OjUxNzUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctY3JlZGVudGlhbHMnXSA9ICd0cnVlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVzLmhlYWRlcnNbJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnXSA9ICdHRVQsSEVBRCxQVVQsUEFUQ0gsUE9TVCxERUxFVEUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snYWNjZXNzLWNvbnRyb2wtYWxsb3ctaGVhZGVycyddID0gJ0NvbnRlbnQtVHlwZSxBdXRob3JpemF0aW9uLENvb2tpZSxYLVJlcXVlc3RlZC1XaXRoJztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVUsT0FBTyxXQUFXO0FBQ25WLE9BQU87QUFDUCxPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjLDhCQUE4QjtBQUNyRCxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUwxQixJQUFNLG1DQUFtQztBQWF6QyxJQUFNLGlCQUFpQixNQUFtQjtBQUN6QyxNQUFJLFFBQVEsSUFBSSx1QkFBdUI7QUFDdEMsUUFBSTtBQUNILGFBQU8sS0FBSyxNQUFNLFFBQVEsSUFBSSxxQkFBcUI7QUFBQSxJQUNwRCxTQUFTLEtBQWM7QUFDdEIsY0FBUSxNQUFNLHVDQUF1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
