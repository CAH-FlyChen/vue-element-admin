/* eslint-disable vue/valid-v-for */

<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="onSaveForm">
          Save
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-tabs :tab-position="right">
          <el-tab-pane label="Basic Info">
            <el-row>
              <Warning />
              <el-col :span="24">
                <div class="postInfo-container">

                  <el-form-item class="postInfo-container-item" label="Enabled">
                    <label slot="label">
                      Enabled <el-tooltip effect="dark" content="Specifies if client is enabled. Defaults to true." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-switch v-model="postForm.enabled" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item v-if="isEdit==false" class="postInfo-container-item" label="ClientId">
                    <label slot="label">
                      ClientId <el-tooltip effect="dark" content="Unique ID of the client" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-input v-model="postForm.clientId" placeholder="" />
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Require Client Secret">
                    <label slot="label">
                      Require Client Secret <el-tooltip effect="dark" content="Specifies whether this client needs a secret to request tokens from the token endpoint (defaults to true)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-switch v-model="postForm.requireClientSecret" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Require Pkce">
                    <label slot="label">
                      Require Pkce <el-tooltip effect="dark" content="Specifies whether clients using an authorization code based grant type must send a proof key" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-switch v-model="postForm.requirePkce" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Allow Plain Text Pkce">
                    <label slot="label">
                      Allow Plain Text Pkce <el-tooltip effect="dark" content="Specifies whether clients using PKCE can use a plain text code challenge (not recommended - and default to false)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.allowPlainTextPkce" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Allow Offline Access">
                    <label slot="label">
                      Allow Offline Access <el-tooltip effect="dark" content="Specifies whether this client can request refresh tokens (be requesting the offline_access scope)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.allowOfflineAccess" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Allow AccessTokens Via Browser">
                    <label slot="label">
                      Allow AccessTokens Via Browser <el-tooltip effect="dark" content="Specifies whether this client is allowed to receive access tokens via the browser. This is useful to harden flows that allow multiple response types (e.g. by disallowing a hybrid flow client that is supposed to use code id_token to add the token response type and thus leaking the token to the browser." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.allowAccessTokensViaBrowser" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Client Secrets" style="width:90%">

                    <label slot="label">
                      Client Secrets <el-tooltip effect="dark" content="List of client secrets - credentials to access the token endpoint." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.clientSecrets">
                          <el-alert :key="item.id" :description="item.value" :title="'【'+item.type+'】  ' +item.description + '       exp:'+ item.expiration" type="success">
                            <div slot="title">
                              {{ item.type }}
                              <label style="margin-left:10px;">{{ item.description }}</label>
                              <label style="float:right;width:100px">exp:{{ item.expiration }}</label>
                            </div>
                          </el-alert>
                        </template>

                        <!-- <el-alert title="消息提示的文案" type="info" />
                            <el-alert title="警告提示的文案" type="warning" />
                            <el-alert title="错误提示的文案" type="error" /> -->
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Allowed Scopes" style="width:90%">
                    <label slot="label">
                      Allowed Scopes <el-tooltip effect="dark" content="Specifies the grant types the client is allowed to use. Use the GrantTypes class for common combinations." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-row>
                      <el-col>
                        <el-tag
                          v-for="tag in postForm.allowedScopes"
                          :key="tag.id"
                          style="margin-left:5px"
                          closable
                        >
                          {{ tag.scope }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Redirect Uris" style="width:90%">
                    <label slot="label">
                      Redirect Uris <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.redirectUris">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.redirectUri }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>

                    </el-row>
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Post Logout Redirect Uris" style="width:90%">

                    <label slot="label">
                      Post Logout Redirect Uris <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.postLogoutRedirectUris">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.postLogoutRedirectUri }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>

                    </el-row>
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Allowed Grant Types" style="width:90%">

                    <label slot="label">
                      Allowed Grant Types <el-tooltip effect="dark" content="Specifies the grant types the client is allowed to use. Use the GrantTypes class for common combinations." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-row>
                      <el-col>
                        <div v-if="isEdit">
                          <el-tag
                            v-for="tag in postForm.allowedGrantTypes"
                            :key="tag.id"
                            style="margin-left:5px"
                            closable
                          >
                            {{ tag.grantType+"ccccc" }}
                          </el-tag>
                        </div>
                        <div v-else>
                          {{ postForm.AllAllowedGrantTypes }}
                          <el-checkbox-group v-model="postForm.allowedGrantTypes" @change="handleCheckedAllowedGrantTypesChange">
                            <el-checkbox v-for="item in postForm.allAllowedGrantTypes" :key="item.code" :label="item.name">{{ item.name }}</el-checkbox>
                          </el-checkbox-group>
                          <!-- <el-checkbox v-model="checked">授权码模式（authorization code）</el-checkbox> -->
                          <!-- <el-checkbox v-model="checked">简化模式（implicit）</el-checkbox>
                          <el-checkbox v-model="checked">密码模式（resource owner password credentials）</el-checkbox>
                          <el-checkbox v-model="checked">客户端模式（client credentials）</el-checkbox> -->
                          <!-- <el-tag
                            v-for="tag in postForm.allowedGrantTypes"
                            :key="tag"
                            style="margin-left:5px"
                            closable
                          >
                            {{ tag+"dddd" }}
                          </el-tag> -->
                        </div>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Allowed Cors Origins" style="width:90%">
                    <label slot="label">
                      Allowed Cors Origins <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.allowedCorsOrigins">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.origin }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Identity Provider Restrictions" style="width:90%">

                    <label slot="label">
                      Identity Provider Restrictions <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.identityProviderRestrictions">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.provider }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>

                    </el-row>
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Claims" style="width:90%">

                    <label slot="label">
                      Claims <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <el-tag
                          v-for="tag in postForm.claims"
                          :key="tag.id"
                          style="margin-left:5px"
                          closable
                        >
                          {{ tag.Type }}  --- {{ tag.value }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item class="postInfo-container-item" label="Properties" style="width:90%">
                    <label slot="label">
                      Properties <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.identityProviderRestrictions">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.key }}== {{ item.value }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>
                    </el-row>
                  </el-form-item>

                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- Authentication or logout================================================================================================ -->
          <el-tab-pane label="Authentication/Logout">
            <el-row>
              <Warning />
              <el-col :span="24">
                <div class="postInfo-container">
                  <el-form-item class="postInfo-container-item" label="Front Channel Logout Uri">
                    <label slot="label">
                      Front Channel Logout Uri <el-tooltip effect="dark" content="Specifies logout URI at client for HTTP based front-channel logout. See the OIDC Front-Channel spec for more details." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-input v-model="postForm.frontChannelLogoutUri" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Front Channel Logout Session Required">
                    <label slot="label">
                      Front Channel Logout Session Required <el-tooltip effect="dark" content="Specifies if the user’s session id should be sent to the FrontChannelLogoutUri. Defaults to true." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.frontChannelLogoutSessionRequired" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Back Channel Logout Uri">
                    <label slot="label">
                      Back Channel Logout Uri <el-tooltip effect="dark" content="Specifies logout URI at client for HTTP based back-channel logout. See the OIDC Back-Channel spec for more details." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.backChannelLogoutUri" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Back Channel Logout Session Required">

                    <label slot="label">
                      Back Channel Logout Session Required <el-tooltip effect="dark" content="Specifies if the user’s session id should be sent in the request to the BackChannelLogoutUri. Defaults to true." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.backChannelLogoutSessionRequired" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Enable Local Login">

                    <label slot="label">
                      Enable Local Login <el-tooltip effect="dark" content="Specifies if this client can use local accounts, or external IdPs only. Defaults to true." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.enableLocalLogin" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="User Sso Life time ">

                    <label slot="label">
                      User Sso Life time <el-tooltip effect="dark" content="The maximum duration (in seconds) since the last time the user authenticated. Defaults to null. You can adjust the lifetime of a session token to control when and how often a user is required to reenter credentials instead of being silently authenticated, when using a web application." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.userSsoLifetime " placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Post Logout Redirect Uris" style="width:90%">

                    <label slot="label">
                      Post Logout Redirect Uris <el-tooltip effect="dark" content="Specifies allowed URIs to redirect to after logout. See the OIDC Connect Session Management spec for more details." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.postLogoutRedirectUris">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.postLogoutRedirectUri }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>
                    </el-row>

                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Identity Provider Restrictions" style="width:90%">
                    <label slot="label">
                      Identity Provider Restrictions <el-tooltip effect="dark" content="Specifies which external IdPs can be used with this client (if list is empty all IdPs are allowed). Defaults to empty." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-row>
                      <el-col>
                        <template v-for="item in postForm.identityProviderRestrictions">
                          <el-alert :key="item.id" type="success">
                            <div slot="title">
                              {{ item.provider }}
                            </div>
                          </el-alert>
                        </template>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Token">
            <el-row>
              <Warning />
              <el-col :span="24">
                <div class="postInfo-container">

                  <el-form-item class="postInfo-container-item" label="Identity Token Lifetime">
                    <label slot="label">
                      Identity Token Lifetime <el-tooltip effect="dark" content="Lifetime to identity token in seconds (defaults to 300 seconds / 5 minutes)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.identityTokenLifetime" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="AccessToken Lifetime">
                    <label slot="label">
                      AccessToken Lifetime <el-tooltip effect="dark" content="Lifetime of access token in seconds (defaults to 3600 seconds / 1 hour)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-input v-model="postForm.accessTokenLifetime" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Authorization Code Lifetime">
                    <label slot="label">
                      Authorization Code Lifetime <el-tooltip effect="dark" content="Lifetime of authorization code in seconds (defaults to 300 seconds / 5 minutes)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.authorizationCodeLifetime" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Absolute Refresh Token Lifetime">

                    <label slot="label">
                      Absolute Refresh Token Lifetime <el-tooltip effect="dark" content="Maximum lifetime of a refresh token in seconds. Defaults to 2592000 seconds / 30 days" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-input v-model="postForm.absoluteRefreshTokenLifetime" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="Sliding Refresh Token Lifetime">
                    <label slot="label">
                      Sliding Refresh Token Lifetime <el-tooltip effect="dark" content="Sliding lifetime of a refresh token in seconds. Defaults to 1296000 seconds / 15 days" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.slidingRefreshTokenLifetime" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="RefreshTokenUsage  selection">

                    <label slot="label">
                      RefreshTokenUsage  selection <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-input v-model="postForm.xxxx" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="RefreshTokenExpiration selection">

                    <label slot="label">
                      RefreshTokenExpiration selection <el-tooltip effect="dark" content="" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.xxxx" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="UpdateAccessTokenClaimsOnRefresh">
                    <label slot="label">
                      UpdateAccessTokenClaimsOnRefresh <el-tooltip effect="dark" content="Gets or sets a value indicating whether the access token (and its claims) should be updated on a refresh token request." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.UupdateAccessTokenClaimsOnRefresh" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="AccessTokenType">
                    <label slot="label">
                      AccessTokenType <el-tooltip effect="dark" content="Specifies whether the access token is a reference token or a self contained JWT token (defaults to Jwt)." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.accessTokenType" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="IncludeJwtId">
                    <label slot="label">
                      IncludeJwtId <el-tooltip effect="dark" content="Specifies whether JWT access tokens should have an embedded unique ID (via the jti claim)." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.includeJwtId" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="AllowedCorsOrigins">
                    <label slot="label">
                      AllowedCorsOrigins <el-tooltip effect="dark" content="If specified, will be used by the default CORS policy service implementations (In-Memory and EF) to build a CORS policy for JavaScript clients." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.allowedCorsOrigins" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="AlwaysSendClientClaims">
                    <label slot="label">
                      AlwaysSendClientClaims <el-tooltip effect="dark" content="If set, the client claims will be sent for every flow. If not, only for client credentials flow (default is false)" placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-switch v-model="postForm.alwaysSendClientClaims" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="AlwaysIncludeUserClaimsInIdToken">
                    <label slot="label">
                      AlwaysIncludeUserClaimsInIdToken <el-tooltip effect="dark" content="When requesting both an id token and access token, should the user claims always be added to the id token instead of requring the client to use the userinfo endpoint. Default is false." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-switch v-model="postForm.alwaysIncludeUserClaimsInIdToken" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="ClientClaimsPrefix">
                    <label slot="label">
                      ClientClaimsPrefix <el-tooltip effect="dark" content="If set, the prefix client claim types will be prefixed with. Defaults to client_. The intent is to make sure they don’t accidentally collide with user claims." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>
                    <el-input v-model="postForm.clientClaimsPrefix" placeholder="" />
                  </el-form-item>

                  <el-form-item class="postInfo-container-item" label="PairWiseSubjectSalt">
                    <label slot="label">
                      PairWiseSubjectSalt <el-tooltip effect="dark" content="Salt value used in pair-wise subjectId generation for users of this client." placement="top">
                        <i class="el-icon-info" />
                      </el-tooltip>
                    </label>

                    <el-input v-model="postForm.pairWiseSubjectSalt" placeholder="" />
                  </el-form-item>
                </div></el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Consent Screen">
            <el-row><el-col :span="24">

              <el-form-item class="postInfo-container-item" label="RequireConsent">

                <label slot="label">
                  RequireConsent <el-tooltip effect="dark" content="Specifies whether a consent screen is required. Defaults to true." placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-switch v-model="postForm.requireConsent" active-color="#13ce66" inactive-color="#ff4949" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="AllowRememberConsent">
                <label slot="label">
                  AllowRememberConsent <el-tooltip effect="dark" content="Specifies whether user can choose to store consent decisions. Defaults to true." placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-switch v-model="postForm.allowRememberConsent" active-color="#13ce66" inactive-color="#ff4949" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="ConsentLifetime">
                <label slot="label">
                  ConsentLifetime <el-tooltip effect="dark" content="Lifetime of a user consent in seconds. Defaults to null (no expiration)." placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-input v-model="postForm.consentLifetime" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="ClientName">
                <label slot="label">
                  ClientName <el-tooltip effect="dark" content="Client display name (used for logging and consent screen)" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-input v-model="postForm.clientName" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="ClientUri">
                <label slot="label">
                  ClientUri <el-tooltip effect="dark" content="URI to further information about client (used on consent screen)" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.clientUri" placeholder="" />
              </el-form-item>

              <el-form-item class="postInfo-container-item" label="LogoUri">
                <label slot="label">
                  LogoUri <el-tooltip effect="dark" content="URI to client logo (used on consent screen)" placement="top">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>
                <el-input v-model="postForm.logoUri" placeholder="" />
              </el-form-item>
            </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Device flow">
            <el-row>
              <el-col :span="24">

                <el-form-item class="postInfo-container-item" label="UserCodeType">
                  <label slot="label">
                    UserCodeType <el-tooltip effect="dark" content="Specifies the type of user code to use for the client. Otherwise falls back to default." placement="top">
                      <i class="el-icon-info" />
                    </el-tooltip>
                  </label>
                  <el-input v-model="postForm.userCodeType" placeholder="" />
                </el-form-item>

                <el-form-item class="postInfo-container-item" label="DeviceCodeLifetime">
                  <label slot="label">
                    DeviceCodeLifetime <el-tooltip effect="dark" content="Lifetime to device code in seconds (defaults to 300 seconds / 5 minutes)" placement="top">
                      <i class="el-icon-info" />
                    </el-tooltip>
                  </label>
                  <el-input v-model="postForm.deviceCodeLifetime" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/SingleImage3'
// import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
import { fetchClient } from '@/api/identity-client'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: 'draft',
  id: undefined,
  enabled: true,
  clientId: 'New',
  allowOfflineAccess: true,
  allowedGrantTypes: [],
  clientName: '测试',
  description: '描述内容',
  allAllowedGrantTypes: [
    { 'code': 'AuthorizationCode', 'name': '授权码模式' },
    { 'code': 'Implicit', 'name': '简化模式' },
    { 'code': 'ResourceOwnerPasswordCredentials', 'name': '密码模式' },
    { 'code': 'ClientCredentials', 'name': '客户端模式' }
  ]
}

export default {
  name: 'ClientDetail',
  // components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  // components: { Tinymce, MDinput, Upload, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  components: { Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    // const validateSourceUri = (rule, value, callback) => {
    //   if (value) {
    //     if (validURL(value)) {
    //       callback()
    //     } else {
    //       this.$message({
    //         message: '外链url填写不正确',
    //         type: 'error'
    //       })
    //       callback(new Error('外链url填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      console.log('not edit mode')
      // const type = this.$route.params && this.$route.params.type
      this.postForm = Object.assign({}, defaultForm)
      console.log(this.postForm)
      this.postForm.allowedGrantTypes = ['授权码模式']
      // this.postForm.AllAllowedGrantTypes = ['001', '002', '003']
      // if (type === 'resource_owner') {
      //   this.postForm.allowedGrantTypes = ['001', '002']
      // } else {
      //   this.postForm.allowedGrantTypes = ['001', '002']
      // }
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchClient(id).then(response => {
        this.postForm = response
        debugger
        // just for test
        // this.postForm.title += `   Article Id:${this.postForm.id}`
        // this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        // this.setTagsViewTitle()

        // set page title
        // this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSaveForm() {
      debugger
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      // searchUser(query).then(response => {
      //   if (!response.data.items) return
      //   this.userListOptions = response.data.items.map(v => v.name)
      // })
    }
  }
}
</script>
<style>
@import "~@/styles/gloable.scss";
.el-alert__content{
  width:100%
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/main.scss";
.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

</style>
