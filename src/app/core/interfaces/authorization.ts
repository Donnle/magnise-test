export interface AuthorizationCredentials {
	username: string;
	password: string;
}

export interface AuthorizationResponse {
	access_token: string;
	expires_in: number; // 1800
	refresh_expires_in: number; // 3600
	refresh_token: string;
	token_type: string;
	'not-before-policy': number;
	session_state: string;
	scope: string;
}
