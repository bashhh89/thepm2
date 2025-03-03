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
      "/v2": {
        target: "https://js.puter.com",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx0aGV3aGl0ZWxhYmVsc2hvd1xcXFxxYW5kdXdoaXRlbGFiZWxcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXHRoZXdoaXRlbGFiZWxzaG93XFxcXHFhbmR1d2hpdGVsYWJlbFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovdGhld2hpdGVsYWJlbHNob3cvcWFuZHV3aGl0ZWxhYmVsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IFwiZG90ZW52L2NvbmZpZ1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBpbmplY3RIVE1MIGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sLWluamVjdFwiO1xuaW1wb3J0IHRzQ29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxudHlwZSBFeHRlbnNpb24gPSB7XG5cdG5hbWU6IHN0cmluZztcblx0dmVyc2lvbjogc3RyaW5nO1xuXHRjb25maWc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufTtcblxuY29uc3QgbGlzdEV4dGVuc2lvbnMgPSAoKTogRXh0ZW5zaW9uW10gPT4ge1xuXHRpZiAocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHByb2Nlc3MuZW52LkRBVEFCVVRUT05fRVhURU5TSU9OUykgYXMgRXh0ZW5zaW9uW107XG5cdFx0fSBjYXRjaCAoZXJyOiB1bmtub3duKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBEQVRBQlVUVE9OX0VYVEVOU0lPTlNcIiwgZXJyKTtcblx0XHRcdGNvbnNvbGUuZXJyb3IocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKTtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW107XG59O1xuXG5jb25zdCBleHRlbnNpb25zID0gbGlzdEV4dGVuc2lvbnMoKTtcblxuY29uc3QgYnVpbGRWYXJpYWJsZXMgPSAoKSA9PiB7XG5cdGNvbnN0IGFwcElkID0gcHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9QUk9KRUNUX0lEO1xuXG5cdGNvbnN0IGRlZmluZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFx0X19BUFBfSURfXzogSlNPTi5zdHJpbmdpZnkoYXBwSWQpLFxuXHRcdF9fQVBJX1BBVEhfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUElfVVJMX186IEpTT04uc3RyaW5naWZ5KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwXCIpLFxuXHRcdF9fV1NfQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcIndzOi8vbG9jYWxob3N0OjgwMDBcIiksXG5cdFx0X19BUFBfQkFTRV9QQVRIX186IEpTT04uc3RyaW5naWZ5KFwiL1wiKSxcblx0XHRfX0FQUF9USVRMRV9fOiBKU09OLnN0cmluZ2lmeShcIkRhdGFidXR0b25cIiksXG5cdFx0X19BUFBfRkFWSUNPTl9MSUdIVF9fOiBKU09OLnN0cmluZ2lmeShcIi9mYXZpY29uLWxpZ2h0LnN2Z1wiKSxcblx0XHRfX0FQUF9GQVZJQ09OX0RBUktfXzogSlNPTi5zdHJpbmdpZnkoXCIvZmF2aWNvbi1kYXJrLnN2Z1wiKSxcblx0XHRfX0FQUF9ERVBMT1lfVVNFUk5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfREVQTE9ZX0FQUE5BTUVfXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfREVQTE9ZX0NVU1RPTV9ET01BSU5fXzogSlNPTi5zdHJpbmdpZnkoXCJcIiksXG5cdFx0X19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKSxcblx0fTtcblxuXHRyZXR1cm4gZGVmaW5lcztcbn07XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBkZWZpbmU6IGJ1aWxkVmFyaWFibGVzKCksXG4gICAgcGx1Z2luczogW3JlYWN0KCksIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4oKSwgdHNDb25maWdQYXRocygpLCBpbmplY3RIVE1MKCldLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgXCIvcm91dGVzXCI6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDAwXCIsXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvdjInOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9qcy5wdXRlci5jb20nLFxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncHJveHkgZXJyb3InLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIFJlcXVlc3QgdG8gdGhlIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgUmVzcG9uc2UgZnJvbSB0aGUgVGFyZ2V0OicsIHByb3h5UmVzLnN0YXR1c0NvZGUsIHJlcS51cmwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVSxPQUFPLFdBQVc7QUFDblYsT0FBTztBQUNQLE9BQU8sVUFBVTtBQUNqQixTQUFTLGNBQWMsOEJBQThCO0FBQ3JELE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sbUJBQW1CO0FBTDFCLElBQU0sbUNBQW1DO0FBYXpDLElBQU0saUJBQWlCLE1BQW1CO0FBQ3pDLE1BQUksUUFBUSxJQUFJLHVCQUF1QjtBQUN0QyxRQUFJO0FBQ0gsYUFBTyxLQUFLLE1BQU0sUUFBUSxJQUFJLHFCQUFxQjtBQUFBLElBQ3BELFNBQVMsS0FBYztBQUN0QixjQUFRLE1BQU0sdUNBQXVDLEdBQUc7QUFDeEQsY0FBUSxNQUFNLFFBQVEsSUFBSSxxQkFBcUI7QUFDL0MsYUFBTyxDQUFDO0FBQUEsSUFDVDtBQUFBLEVBQ0Q7QUFFQSxTQUFPLENBQUM7QUFDVDtBQUVBLElBQU0sYUFBYSxlQUFlO0FBRWxDLElBQU0saUJBQWlCLE1BQU07QUFDNUIsUUFBTSxRQUFRLFFBQVEsSUFBSTtBQUUxQixRQUFNLFVBQWtDO0FBQUEsSUFDdkMsWUFBWSxLQUFLLFVBQVUsS0FBSztBQUFBLElBQ2hDLGNBQWMsS0FBSyxVQUFVLEVBQUU7QUFBQSxJQUMvQixhQUFhLEtBQUssVUFBVSx1QkFBdUI7QUFBQSxJQUNuRCxnQkFBZ0IsS0FBSyxVQUFVLHFCQUFxQjtBQUFBLElBQ3BELG1CQUFtQixLQUFLLFVBQVUsR0FBRztBQUFBLElBQ3JDLGVBQWUsS0FBSyxVQUFVLFlBQVk7QUFBQSxJQUMxQyx1QkFBdUIsS0FBSyxVQUFVLG9CQUFvQjtBQUFBLElBQzFELHNCQUFzQixLQUFLLFVBQVUsbUJBQW1CO0FBQUEsSUFDeEQseUJBQXlCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDMUMsd0JBQXdCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDekMsOEJBQThCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDL0MsaUJBQWlCLEtBQUssVUFBVSxRQUFRLElBQUksbUJBQW1CO0FBQUEsRUFDaEU7QUFFQSxTQUFPO0FBQ1I7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixRQUFRLGVBQWU7QUFBQSxFQUN2QixTQUFTLENBQUMsTUFBTSxHQUFHLHVCQUF1QixHQUFHLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFBQSxFQUMxRSxRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxXQUFXO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDbEI7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNILFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQSxRQUNKLFdBQVcsQ0FBQyxPQUFPLGFBQWE7QUFDNUIsZ0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxNQUFNLFNBQVM7QUFDbkMsb0JBQVEsSUFBSSxlQUFlLEdBQUc7QUFBQSxVQUNsQyxDQUFDO0FBQ0QsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVM7QUFDMUMsb0JBQVEsSUFBSSxrQ0FBa0MsSUFBSSxRQUFRLElBQUksR0FBRztBQUFBLFVBQ3JFLENBQUM7QUFDRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUMxQyxvQkFBUSxJQUFJLHNDQUFzQyxTQUFTLFlBQVksSUFBSSxHQUFHO0FBQUEsVUFDbEYsQ0FBQztBQUFBLFFBQ0w7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
