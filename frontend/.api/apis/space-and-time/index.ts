import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'space-and-time/0.1 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Register with the Gateway (Secrets Proxy) and SxT network
   *
   * @summary Register
   * @throws FetchError<400, types.RegisterResponse400> Bad Request
   * @throws FetchError<500, types.RegisterResponse500> Internal Server Error
   */
  register(body: types.RegisterBodyParam): Promise<FetchResponse<200, types.RegisterResponse200>> {
    return this.core.fetch('/auth/register', 'post', body);
  }

  /**
   * Authenticate with the Gateway (Secrets Proxy) and SxT network
   *
   * @summary Login
   * @throws FetchError<400, types.LoginResponse400> Bad Request
   * @throws FetchError<500, types.LoginResponse500> Internal Server Error
   */
  login(body: types.LoginBodyParam): Promise<FetchResponse<200, types.LoginResponse200>> {
    return this.core.fetch('/auth/login', 'post', body);
  }

  /**
   * Take an existing user with the SxT network and add Gateway (Secrets Proxy)
   * authentication support. A password will be automatically generated on your behalf. Use
   * the reset password API to change it if you'd like
   *
   * @summary Add account for existing user
   * @throws FetchError<400, types.AddExistingUserResponse400> Bad Request
   * @throws FetchError<500, types.AddExistingUserResponse500> Internal Server Error
   */
  addExistingUser(metadata: types.AddExistingUserMetadataParam): Promise<FetchResponse<200, types.AddExistingUserResponse200>> {
    return this.core.fetch('/auth/add-existing', 'post', metadata);
  }

  /**
   * Reset your password
   *
   * @summary Reset password
   * @throws FetchError<401, types.ResetPasswordResponse401> Unauthorized
   * @throws FetchError<500, types.ResetPasswordResponse500> Internal Server Error
   */
  resetPassword(body: types.ResetPasswordBodyParam, metadata: types.ResetPasswordMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/auth/reset', 'post', body, metadata);
  }

  /**
   * Refresh a Gateway (Secrets Proxy) authenticated session. Use this API to refresh the
   * Secrets-Proxy specific session token
   *
   * @summary Refresh session
   * @throws FetchError<401, types.RefreshSessionResponse401> Unauthorized
   * @throws FetchError<500, types.RefreshSessionResponse500> Internal Server Error
   */
  refreshSession(metadata: types.RefreshSessionMetadataParam): Promise<FetchResponse<200, types.RefreshSessionResponse200>> {
    return this.core.fetch('/auth/session/refresh', 'post', metadata);
  }

  /**
   * Convert an authenticated session with the SxT network into an authenticated Gateway
   * (Secrets Proxy) session
   *
   * @summary Convert session
   * @throws FetchError<400, types.ConvertSessionResponse400> Bad Request
   * @throws FetchError<401, types.ConvertSessionResponse401> Unauthorized
   * @throws FetchError<403, types.ConvertSessionResponse403> Forbidden
   * @throws FetchError<500, types.ConvertSessionResponse500> Internal Server Error
   */
  convertSession(metadata: types.ConvertSessionMetadataParam): Promise<FetchResponse<200, types.ConvertSessionResponse200>> {
    return this.core.fetch('/auth/session/convert', 'post', metadata);
  }

  /**
   * Authenticate with the SxT network via a Gateway Proxy API Key
   *
   * @summary API Key Login
   * @throws FetchError<401, types.ApikeyAuthnResponse401> Unauthorized
   */
  apikeyAuthn(metadata: types.ApikeyAuthnMetadataParam): Promise<FetchResponse<200, types.ApikeyAuthnResponse200>> {
    return this.core.fetch('/auth/apikey', 'post', metadata);
  }

  /**
   * Get all biscuits available to the user. This API returns both user-generated biscuits as
   * well as biscuits auto-generated by the Gateway (Secrets Proxy). The response payload
   * also includes helpful metadata including what resources a given biscuit authorizes
   * access to as well as what operations are allowed on that resource.
   *
   * @summary Get all biscuits
   * @throws FetchError<401, types.GetAllBiscuitsResponse401> Unauthorized
   * @throws FetchError<500, types.GetAllBiscuitsResponse500> Internal Server Error
   */
  getAllBiscuits(metadata: types.GetAllBiscuitsMetadataParam): Promise<FetchResponse<200, types.GetAllBiscuitsResponse200>> {
    return this.core.fetch('/biscuits', 'get', metadata);
  }

  /**
   * Get all user generated biscuits. This API will only return biscuits manually generated
   * and uploaded by the user.
   *
   * @summary Get all user biscuits
   * @throws FetchError<401, types.GetAllUserBiscuitsResponse401> Unauthorized
   * @throws FetchError<500, types.GetAllUserBiscuitsResponse500> Internal Server Error
   */
  getAllUserBiscuits(metadata: types.GetAllUserBiscuitsMetadataParam): Promise<FetchResponse<200, types.GetAllUserBiscuitsResponse200>> {
    return this.core.fetch('/biscuits/generated', 'get', metadata);
  }

  /**
   * Add a user generated biscuit. In this API, you provide a biscuit, a unique name you'd
   * like to call this biscuit, and the public key to validate the biscuit. The Gateway
   * (Secrets Proxy) will use this information to parse the biscuit and determine what the
   * underlying biscuit payload enables so that it can be used going forward.
   *
   * @summary Add user biscuit
   * @throws FetchError<400, types.AddUserBiscuitResponse400> Bad Request
   * @throws FetchError<401, types.AddUserBiscuitResponse401> Unauthorized
   * @throws FetchError<404, types.AddUserBiscuitResponse404> Not Found
   * @throws FetchError<500, types.AddUserBiscuitResponse500> Internal Server Error
   */
  addUserBiscuit(body: types.AddUserBiscuitBodyParam, metadata: types.AddUserBiscuitMetadataParam): Promise<FetchResponse<200, types.AddUserBiscuitResponse200>> {
    return this.core.fetch('/biscuits/generated', 'post', body, metadata);
  }

  /**
   * Get a user generated biscuit by name
   *
   * @summary Get user biscuit by name
   * @throws FetchError<401, types.GetUserBiscuitByNameResponse401> Unauthorized
   * @throws FetchError<404, types.GetUserBiscuitByNameResponse404> Not Found
   * @throws FetchError<500, types.GetUserBiscuitByNameResponse500> Internal Server Error
   */
  getUserBiscuitByName(metadata: types.GetUserBiscuitByNameMetadataParam): Promise<FetchResponse<200, types.GetUserBiscuitByNameResponse200>> {
    return this.core.fetch('/biscuits/generated/{biscuitName}', 'get', metadata);
  }

  /**
   * Remove a user generated biscuit
   *
   * @summary Remove user biscuit
   * @throws FetchError<400, types.RemoveUserBiscuitResponse400> Bad Request
   * @throws FetchError<401, types.RemoveUserBiscuitResponse401> Unauthorized
   * @throws FetchError<404, types.RemoveUserBiscuitResponse404> Not Found
   * @throws FetchError<500, types.RemoveUserBiscuitResponse500> Internal Server Error
   */
  removeUserBiscuit(metadata: types.RemoveUserBiscuitMetadataParam): Promise<FetchResponse<204, types.RemoveUserBiscuitResponse204>> {
    return this.core.fetch('/biscuits/generated/{biscuitName}', 'delete', metadata);
  }

  /**
   * Set user permissions on a given resource. NOTE: the resource must have been created via
   * the Gateway (Secrets Proxy)
   *
   * @summary Set resource permissions
   * @throws FetchError<401, types.SetPermissionResponse401> Unauthorized
   * @throws FetchError<403, types.SetPermissionResponse403> Forbidden
   * @throws FetchError<404, types.SetPermissionResponse404> Not Found
   * @throws FetchError<500, types.SetPermissionResponse500> Internal Server Error
   */
  setPermission(metadata: types.SetPermissionMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/permissions', 'put', metadata);
  }

  /**
   * Remove a user's permission on a given resource. NOTE: the resource must have been
   * created via the Gateway (Secrets Proxy)
   *
   * @summary Remove permissions
   * @throws FetchError<401, types.RemovePermissionResponse401> Unauthorized
   * @throws FetchError<403, types.RemovePermissionResponse403> Forbidden
   * @throws FetchError<404, types.RemovePermissionResponse404> Not Found
   * @throws FetchError<500, types.RemovePermissionResponse500> Internal Server Error
   */
  removePermission(metadata: types.RemovePermissionMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/permissions', 'delete', metadata);
  }

  /**
   * Get all permissions granted to the current user
   *
   * @summary Get user permissions
   * @throws FetchError<401, types.GetUserPermissionsResponse401> Unauthorized
   * @throws FetchError<500, types.GetUserPermissionsResponse500> Internal Server Error
   */
  getUserPermissions(metadata: types.GetUserPermissionsMetadataParam): Promise<FetchResponse<200, types.GetUserPermissionsResponse200>> {
    return this.core.fetch('/permissions/user', 'get', metadata);
  }

  /**
   * Get all permissions configured on the specified resource. Note that you must have
   * CONFIGURE level permissions on the resource for this to work.
   *
   * @summary Get resource permissions
   * @throws FetchError<401, types.GetResourcePermissionsResponse401> Unauthorized
   * @throws FetchError<403, types.GetResourcePermissionsResponse403> Forbidden
   * @throws FetchError<404, types.GetResourcePermissionsResponse404> Not Found
   * @throws FetchError<500, types.GetResourcePermissionsResponse500> Internal Server Error
   */
  getResourcePermissions(metadata: types.GetResourcePermissionsMetadataParam): Promise<FetchResponse<200, types.GetResourcePermissionsResponse200>> {
    return this.core.fetch('/permissions/resource', 'get', metadata);
  }

  /**
   * Retrieve all user created API keys. Note that only the API key identifier and
   * user-provided description will be returned. The full API key is not stored server-side
   * for security reasons.
   *
   * @summary Get all API keys
   * @throws FetchError<401, types.GetApiKeysResponse401> Unauthorized
   * @throws FetchError<404, types.GetApiKeysResponse404> Not Found
   * @throws FetchError<500, types.GetApiKeysResponse500> Internal Server Error
   */
  getApiKeys(metadata: types.GetApiKeysMetadataParam): Promise<FetchResponse<200, types.GetApiKeysResponse200>> {
    return this.core.fetch('/apikeys', 'get', metadata);
  }

  /**
   * Generate a new API key. The returned string is the full API Key and is not stored
   * server-side.
   *
   * @summary Create API key
   * @throws FetchError<401, types.CreateApiKeyResponse401> Unauthorized
   * @throws FetchError<403, types.CreateApiKeyResponse403> Forbidden
   * @throws FetchError<500, types.CreateApiKeyResponse500> Internal Server Error
   */
  createApiKey(body: types.CreateApiKeyBodyParam, metadata: types.CreateApiKeyMetadataParam): Promise<FetchResponse<201, types.CreateApiKeyResponse201>>;
  createApiKey(metadata: types.CreateApiKeyMetadataParam): Promise<FetchResponse<201, types.CreateApiKeyResponse201>>;
  createApiKey(body?: types.CreateApiKeyBodyParam | types.CreateApiKeyMetadataParam, metadata?: types.CreateApiKeyMetadataParam): Promise<FetchResponse<201, types.CreateApiKeyResponse201>> {
    return this.core.fetch('/apikeys', 'post', body, metadata);
  }

  /**
   * Delete an API key by identifier
   *
   * @summary Delete an API key
   * @throws FetchError<401, types.DeleteApiKeyResponse401> Unauthorized
   * @throws FetchError<404, types.DeleteApiKeyResponse404> Not Found
   * @throws FetchError<500, types.DeleteApiKeyResponse500> Internal Server Error
   */
  deleteApiKey(metadata: types.DeleteApiKeyMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/apikeys/{keyId}', 'delete', metadata);
  }

  /**
   * Using this endpoint, you can execute any kind of SQL statement (DQL, DML, DDL). This API
   * goes through the Gateway (Secrets Proxy), and unlike the [Generic SQL
   * API](ref:execute-sql-generic) or related DQL, DML, and DDL APIs, this API will handle
   * authentication and authorization tokens required by the SxT Network. For example, the
   * API Key you specify in the header (created via the [API Key API](ref:create-api-key))
   * does not expire like the access token required in the Generic SQL API (via the bearer
   * token `Authorization` header); instead, the Gateway manages your session with the SxT
   * Network (reauthenticating you with the SxT Network automatically as necessary).
   * Similarly, resources and permissions created and biscuits uploaded to the Gateway will
   * automatically be provided to the SxT Network to authorize your request on your behalf.
   * You can also provide biscuits manually as part of the request body and they will be
   * forwarded to the SxT Network. The ease of getting started and usability of this API
   * results in slightly slower performance, so if performance is critical to your
   * application, we recommend you use the SQL APIs that go direct to the SxT Network.
   *
   * @summary Proxy Execute SQL
   * @throws FetchError<400, types.ExecuteProxySqlGenericResponse400> Bad Request
   * @throws FetchError<401, types.ExecuteProxySqlGenericResponse401> Unauthorized
   * @throws FetchError<403, types.ExecuteProxySqlGenericResponse403> Forbidden
   * @throws FetchError<404, types.ExecuteProxySqlGenericResponse404> Not Found
   * @throws FetchError<503, types.ExecuteProxySqlGenericResponse503> Service Unavailable
   */
  executeProxySqlGeneric(body: types.ExecuteProxySqlGenericBodyParam, metadata: types.ExecuteProxySqlGenericMetadataParam): Promise<FetchResponse<200, types.ExecuteProxySqlGenericResponse200>> {
    return this.core.fetch('/v1/sql', 'post', body, metadata);
  }

  /**
   * Using this endpoint, you can execute a query created via the Content APIs. This API goes
   * through the Gateway (Secrets Proxy), and unlike the direct to SxT Network [Execute a
   * content query API](ref:execute-content-queries), this API will handle authentication and
   * authorization tokens required by the SxT Network. For example, the API Key you specify
   * in the header (created via the [API Key API](ref:create-api-key)) does not expire like
   * the access token required in the Generic SQL API (via the bearer token `Authorization`
   * header); instead, the Gateway manages your session with the SxT Network
   * (reauthenticating you with the SxT Network automatically as necessary). Similarly,
   * resources and permissions created and biscuits uploaded to the Gateway will
   * automatically be provided to the SxT Network to authorize your request on your behalf.
   * You can also provide biscuits manually as part of the request body and they will be
   * forwarded to the SxT Network. The ease of getting started and usability of this API
   * results in slightly slower performance.
   *
   * @summary Proxy Execute a content query
   * @throws FetchError<400, types.ExecuteProxySqlContentQueriesResponse400> Bad Request
   * @throws FetchError<401, types.ExecuteProxySqlContentQueriesResponse401> Unauthorized
   * @throws FetchError<403, types.ExecuteProxySqlContentQueriesResponse403> Forbidden
   * @throws FetchError<404, types.ExecuteProxySqlContentQueriesResponse404> Not Found
   * @throws FetchError<503, types.ExecuteProxySqlContentQueriesResponse503> Service Unavailable
   */
  executeProxySqlContentQueries(body: types.ExecuteProxySqlContentQueriesBodyParam, metadata: types.ExecuteProxySqlContentQueriesMetadataParam): Promise<FetchResponse<200, types.ExecuteProxySqlContentQueriesResponse200>> {
    return this.core.fetch('/v1/sql/content-queries', 'post', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { AddExistingUserMetadataParam, AddExistingUserResponse200, AddExistingUserResponse400, AddExistingUserResponse500, AddUserBiscuitBodyParam, AddUserBiscuitMetadataParam, AddUserBiscuitResponse200, AddUserBiscuitResponse400, AddUserBiscuitResponse401, AddUserBiscuitResponse404, AddUserBiscuitResponse500, ApikeyAuthnMetadataParam, ApikeyAuthnResponse200, ApikeyAuthnResponse401, ConvertSessionMetadataParam, ConvertSessionResponse200, ConvertSessionResponse400, ConvertSessionResponse401, ConvertSessionResponse403, ConvertSessionResponse500, CreateApiKeyBodyParam, CreateApiKeyMetadataParam, CreateApiKeyResponse201, CreateApiKeyResponse401, CreateApiKeyResponse403, CreateApiKeyResponse500, DeleteApiKeyMetadataParam, DeleteApiKeyResponse401, DeleteApiKeyResponse404, DeleteApiKeyResponse500, ExecuteProxySqlContentQueriesBodyParam, ExecuteProxySqlContentQueriesMetadataParam, ExecuteProxySqlContentQueriesResponse200, ExecuteProxySqlContentQueriesResponse400, ExecuteProxySqlContentQueriesResponse401, ExecuteProxySqlContentQueriesResponse403, ExecuteProxySqlContentQueriesResponse404, ExecuteProxySqlContentQueriesResponse503, ExecuteProxySqlGenericBodyParam, ExecuteProxySqlGenericMetadataParam, ExecuteProxySqlGenericResponse200, ExecuteProxySqlGenericResponse400, ExecuteProxySqlGenericResponse401, ExecuteProxySqlGenericResponse403, ExecuteProxySqlGenericResponse404, ExecuteProxySqlGenericResponse503, GetAllBiscuitsMetadataParam, GetAllBiscuitsResponse200, GetAllBiscuitsResponse401, GetAllBiscuitsResponse500, GetAllUserBiscuitsMetadataParam, GetAllUserBiscuitsResponse200, GetAllUserBiscuitsResponse401, GetAllUserBiscuitsResponse500, GetApiKeysMetadataParam, GetApiKeysResponse200, GetApiKeysResponse401, GetApiKeysResponse404, GetApiKeysResponse500, GetResourcePermissionsMetadataParam, GetResourcePermissionsResponse200, GetResourcePermissionsResponse401, GetResourcePermissionsResponse403, GetResourcePermissionsResponse404, GetResourcePermissionsResponse500, GetUserBiscuitByNameMetadataParam, GetUserBiscuitByNameResponse200, GetUserBiscuitByNameResponse401, GetUserBiscuitByNameResponse404, GetUserBiscuitByNameResponse500, GetUserPermissionsMetadataParam, GetUserPermissionsResponse200, GetUserPermissionsResponse401, GetUserPermissionsResponse500, LoginBodyParam, LoginResponse200, LoginResponse400, LoginResponse500, RefreshSessionMetadataParam, RefreshSessionResponse200, RefreshSessionResponse401, RefreshSessionResponse500, RegisterBodyParam, RegisterResponse200, RegisterResponse400, RegisterResponse500, RemovePermissionMetadataParam, RemovePermissionResponse401, RemovePermissionResponse403, RemovePermissionResponse404, RemovePermissionResponse500, RemoveUserBiscuitMetadataParam, RemoveUserBiscuitResponse204, RemoveUserBiscuitResponse400, RemoveUserBiscuitResponse401, RemoveUserBiscuitResponse404, RemoveUserBiscuitResponse500, ResetPasswordBodyParam, ResetPasswordMetadataParam, ResetPasswordResponse401, ResetPasswordResponse500, SetPermissionMetadataParam, SetPermissionResponse401, SetPermissionResponse403, SetPermissionResponse404, SetPermissionResponse500 } from './types';
