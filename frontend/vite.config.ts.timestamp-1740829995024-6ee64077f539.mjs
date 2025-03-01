// vite.config.ts
import react from "file:///E:/nexus-suite/frontend/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@4.4.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import "file:///E:/nexus-suite/frontend/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/config.js";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "file:///E:/nexus-suite/frontend/node_modules/.pnpm/vite@4.4.5_@types+node@20.6.2/node_modules/vite/dist/node/index.js";
import injectHTML from "file:///E:/nexus-suite/frontend/node_modules/.pnpm/vite-plugin-html-inject@1.1.2/node_modules/vite-plugin-html-inject/dist/index.mjs";
import tsConfigPaths from "file:///E:/nexus-suite/frontend/node_modules/.pnpm/vite-tsconfig-paths@4.2.2_typescript@5.2.2_vite@4.4.5/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\nexus-suite\\frontend";
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
var getExtensionConfig = (name) => {
  const extension = extensions.find((it) => it.name === name);
  if (!extension) {
    console.warn(`Extension ${name} not found`);
  }
  return JSON.stringify(extension == null ? void 0 : extension.config);
};
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
    __FIREBASE_CONFIG__: JSON.stringify(
      getExtensionConfig("firebase-auth" /* FIREBASE_AUTH */)
    )
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
      }
    }
  },
  resolve: {
    alias: {
      resolve: {
        alias: {
          "@": path.resolve(__vite_injected_original_dirname, "./src")
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxuZXh1cy1zdWl0ZVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcbmV4dXMtc3VpdGVcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L25leHVzLXN1aXRlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IFwiZG90ZW52L2NvbmZpZ1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBpbmplY3RIVE1MIGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sLWluamVjdFwiO1xuaW1wb3J0IHRzQ29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxudHlwZSBFeHRlbnNpb24gPSB7XG5cdG5hbWU6IHN0cmluZztcblx0dmVyc2lvbjogc3RyaW5nO1xuXHRjb25maWc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufTtcblxuZW51bSBFeHRlbnNpb25OYW1lIHtcblx0RklSRUJBU0VfQVVUSCA9IFwiZmlyZWJhc2UtYXV0aFwiLFxufVxuXG5jb25zdCBsaXN0RXh0ZW5zaW9ucyA9ICgpOiBFeHRlbnNpb25bXSA9PiB7XG5cdGlmIChwcm9jZXNzLmVudi5EQVRBQlVUVE9OX0VYVEVOU0lPTlMpIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UocHJvY2Vzcy5lbnYuREFUQUJVVFRPTl9FWFRFTlNJT05TKSBhcyBFeHRlbnNpb25bXTtcblx0XHR9IGNhdGNoIChlcnI6IHVua25vd24pIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIERBVEFCVVRUT05fRVhURU5TSU9OU1wiLCBlcnIpO1xuXHRcdFx0Y29uc29sZS5lcnJvcihwcm9jZXNzLmVudi5EQVRBQlVUVE9OX0VYVEVOU0lPTlMpO1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBbXTtcbn07XG5cbmNvbnN0IGV4dGVuc2lvbnMgPSBsaXN0RXh0ZW5zaW9ucygpO1xuXG5jb25zdCBnZXRFeHRlbnNpb25Db25maWcgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0Y29uc3QgZXh0ZW5zaW9uID0gZXh0ZW5zaW9ucy5maW5kKChpdCkgPT4gaXQubmFtZSA9PT0gbmFtZSk7XG5cblx0aWYgKCFleHRlbnNpb24pIHtcblx0XHRjb25zb2xlLndhcm4oYEV4dGVuc2lvbiAke25hbWV9IG5vdCBmb3VuZGApO1xuXHR9XG5cblx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KGV4dGVuc2lvbj8uY29uZmlnKTtcbn07XG5cbmNvbnN0IGJ1aWxkVmFyaWFibGVzID0gKCkgPT4ge1xuXHRjb25zdCBhcHBJZCA9IHByb2Nlc3MuZW52LkRBVEFCVVRUT05fUFJPSkVDVF9JRDtcblxuXHRjb25zdCBkZWZpbmVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuXHRcdF9fQVBQX0lEX186IEpTT04uc3RyaW5naWZ5KGFwcElkKSxcblx0XHRfX0FQSV9QQVRIX186IEpTT04uc3RyaW5naWZ5KFwiXCIpLFxuXHRcdF9fQVBJX1VSTF9fOiBKU09OLnN0cmluZ2lmeShcImh0dHA6Ly9sb2NhbGhvc3Q6ODAwMFwiKSxcblx0XHRfX1dTX0FQSV9VUkxfXzogSlNPTi5zdHJpbmdpZnkoXCJ3czovL2xvY2FsaG9zdDo4MDAwXCIpLFxuXHRcdF9fQVBQX0JBU0VfUEFUSF9fOiBKU09OLnN0cmluZ2lmeShcIi9cIiksXG5cdFx0X19BUFBfVElUTEVfXzogSlNPTi5zdHJpbmdpZnkoXCJEYXRhYnV0dG9uXCIpLFxuXHRcdF9fQVBQX0ZBVklDT05fTElHSFRfXzogSlNPTi5zdHJpbmdpZnkoXCIvZmF2aWNvbi1saWdodC5zdmdcIiksXG5cdFx0X19BUFBfRkFWSUNPTl9EQVJLX186IEpTT04uc3RyaW5naWZ5KFwiL2Zhdmljb24tZGFyay5zdmdcIiksXG5cdFx0X19BUFBfREVQTE9ZX1VTRVJOQU1FX186IEpTT04uc3RyaW5naWZ5KFwiXCIpLFxuXHRcdF9fQVBQX0RFUExPWV9BUFBOQU1FX186IEpTT04uc3RyaW5naWZ5KFwiXCIpLFxuXHRcdF9fQVBQX0RFUExPWV9DVVNUT01fRE9NQUlOX186IEpTT04uc3RyaW5naWZ5KFwiXCIpLFxuXHRcdF9fRklSRUJBU0VfQ09ORklHX186IEpTT04uc3RyaW5naWZ5KFxuXHRcdFx0Z2V0RXh0ZW5zaW9uQ29uZmlnKEV4dGVuc2lvbk5hbWUuRklSRUJBU0VfQVVUSCksXG5cdFx0KSxcblx0fTtcblxuXHRyZXR1cm4gZGVmaW5lcztcbn07XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0ZGVmaW5lOiBidWlsZFZhcmlhYmxlcygpLFxuXHRwbHVnaW5zOiBbcmVhY3QoKSwgc3BsaXRWZW5kb3JDaHVua1BsdWdpbigpLCB0c0NvbmZpZ1BhdGhzKCksIGluamVjdEhUTUwoKV0sXG5cdHNlcnZlcjoge1xuXHRcdHByb3h5OiB7XG5cdFx0XHRcIi9yb3V0ZXNcIjoge1xuXHRcdFx0XHR0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDAwXCIsXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0cmVzb2x2ZToge1xuXHRcdGFsaWFzOiB7XG5cdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdGFsaWFzOiB7XG5cdFx0XHRcdFx0XCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsT0FBTyxXQUFXO0FBQy9RLE9BQU87QUFDUCxPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjLDhCQUE4QjtBQUNyRCxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUwxQixJQUFNLG1DQUFtQztBQWlCekMsSUFBTSxpQkFBaUIsTUFBbUI7QUFDekMsTUFBSSxRQUFRLElBQUksdUJBQXVCO0FBQ3RDLFFBQUk7QUFDSCxhQUFPLEtBQUssTUFBTSxRQUFRLElBQUkscUJBQXFCO0FBQUEsSUFDcEQsU0FBUyxLQUFjO0FBQ3RCLGNBQVEsTUFBTSx1Q0FBdUMsR0FBRztBQUN4RCxjQUFRLE1BQU0sUUFBUSxJQUFJLHFCQUFxQjtBQUMvQyxhQUFPLENBQUM7QUFBQSxJQUNUO0FBQUEsRUFDRDtBQUVBLFNBQU8sQ0FBQztBQUNUO0FBRUEsSUFBTSxhQUFhLGVBQWU7QUFFbEMsSUFBTSxxQkFBcUIsQ0FBQyxTQUF5QjtBQUNwRCxRQUFNLFlBQVksV0FBVyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsSUFBSTtBQUUxRCxNQUFJLENBQUMsV0FBVztBQUNmLFlBQVEsS0FBSyxhQUFhLElBQUksWUFBWTtBQUFBLEVBQzNDO0FBRUEsU0FBTyxLQUFLLFVBQVUsdUNBQVcsTUFBTTtBQUN4QztBQUVBLElBQU0saUJBQWlCLE1BQU07QUFDNUIsUUFBTSxRQUFRLFFBQVEsSUFBSTtBQUUxQixRQUFNLFVBQWtDO0FBQUEsSUFDdkMsWUFBWSxLQUFLLFVBQVUsS0FBSztBQUFBLElBQ2hDLGNBQWMsS0FBSyxVQUFVLEVBQUU7QUFBQSxJQUMvQixhQUFhLEtBQUssVUFBVSx1QkFBdUI7QUFBQSxJQUNuRCxnQkFBZ0IsS0FBSyxVQUFVLHFCQUFxQjtBQUFBLElBQ3BELG1CQUFtQixLQUFLLFVBQVUsR0FBRztBQUFBLElBQ3JDLGVBQWUsS0FBSyxVQUFVLFlBQVk7QUFBQSxJQUMxQyx1QkFBdUIsS0FBSyxVQUFVLG9CQUFvQjtBQUFBLElBQzFELHNCQUFzQixLQUFLLFVBQVUsbUJBQW1CO0FBQUEsSUFDeEQseUJBQXlCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDMUMsd0JBQXdCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDekMsOEJBQThCLEtBQUssVUFBVSxFQUFFO0FBQUEsSUFDL0MscUJBQXFCLEtBQUs7QUFBQSxNQUN6QixtQkFBbUIsbUNBQTJCO0FBQUEsSUFDL0M7QUFBQSxFQUNEO0FBRUEsU0FBTztBQUNSO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsUUFBUSxlQUFlO0FBQUEsRUFDdkIsU0FBUyxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDO0FBQUEsRUFDMUUsUUFBUTtBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ04sV0FBVztBQUFBLFFBQ1YsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2Y7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1IsT0FBTztBQUFBLFVBQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLFFBQ3JDO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
