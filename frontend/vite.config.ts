import react from "@vitejs/plugin-react";
import "dotenv/config";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import injectHTML from "vite-plugin-html-inject";
import tsConfigPaths from "vite-tsconfig-paths";

type Extension = {
	name: string;
	version: string;
	config: Record<string, unknown>;
};

const listExtensions = (): Extension[] => {
	if (process.env.DATABUTTON_EXTENSIONS) {
		try {
			return JSON.parse(process.env.DATABUTTON_EXTENSIONS) as Extension[];
		} catch (err: unknown) {
			console.error("Error parsing DATABUTTON_EXTENSIONS", err);
			console.error(process.env.DATABUTTON_EXTENSIONS);
			return [];
		}
	}

	return [];
};

const extensions = listExtensions();

const buildVariables = () => {
	const appId = process.env.DATABUTTON_PROJECT_ID;

	const defines: Record<string, string> = {
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
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	};

	return defines;
};

// https://vite.dev/config/
export default defineConfig({
    define: buildVariables(),
    plugins: [react(), splitVendorChunkPlugin(), tsConfigPaths(), injectHTML()],
    server: {
        proxy: {
            "/routes": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
            },
            "/auth/login": {
                target: "http://localhost:5177",
                rewrite: (path) => "/login",
            },
            '/v2': {
                target: 'https://js.puter.com',
                changeOrigin: true,
                secure: false,
                ws: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.error('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                        proxyReq.setHeader('Origin', 'https://js.puter.com');
                        proxyReq.setHeader('Referer', 'https://js.puter.com');
                        proxyReq.setHeader('Host', 'js.puter.com');
                        if (req.headers.cookie) {
                            proxyReq.setHeader('Cookie', req.headers.cookie);
                        }
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                        proxyRes.headers['access-control-allow-origin'] = req.headers.origin || 'http://localhost:5177';
                        proxyRes.headers['access-control-allow-credentials'] = 'true';
                        proxyRes.headers['access-control-allow-methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
                        proxyRes.headers['access-control-allow-headers'] = 'Content-Type,Authorization,Cookie,X-Requested-With,X-Puter-Token';
                    });
                },
            },
            '/api/puter': {
                target: 'https://api.puter.com',
                changeOrigin: true,
                secure: false,
                ws: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.error('Puter proxy error:', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        // Set proper origin and headers
                        proxyReq.setHeader('Origin', 'https://api.puter.com');
                        proxyReq.setHeader('Referer', 'https://api.puter.com');
                        proxyReq.setHeader('Host', 'api.puter.com');
                        
                        // Handle token
                        const token = req.headers['x-puter-token'];
                        if (token) {
                            proxyReq.setHeader('X-Puter-Token', token);
                            proxyReq.setHeader('Authorization', `Bearer ${token}`);
                        }

                        // Log request for debugging
                        console.log('Sending Puter API Request:', req.method, req.url, token ? '(with token)' : '(no token)');
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        // Set proper CORS headers
                        proxyRes.headers['access-control-allow-origin'] = '*';
                        proxyRes.headers['access-control-allow-methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
                        proxyRes.headers['access-control-allow-headers'] = 'Content-Type,Authorization,X-Puter-Token';
                        proxyRes.headers['access-control-expose-headers'] = 'Content-Type,Authorization,X-Puter-Token';
                        
                        console.log('Received Puter API Response:', proxyRes.statusCode, req.url);
                    });
                },
                rewrite: (path) => path.replace(/^\/api\/puter/, ''),
            }
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
