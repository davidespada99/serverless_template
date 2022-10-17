export interface BuildConfig {
	readonly account: string;
	readonly region: string;
	readonly project: string;
	readonly environment: string;
	readonly stacks: BuildStacks;
}

export interface BuildStacks{
	frontEnd: FrontEndStacks,
	cognito: CognitoStack 
	lambda: LambdaStack[]
	apigateway: ApiGatewayStack[]
}


export interface FrontEndStacks{
	s3: S3Stack,
	cloudfront: CloudFrontStack
}

export interface CognitoStack{
	selfSignUpEnabled: boolean,
	signInAliases: SignInConfig
	email: EmailConfig,
	passwordPolicy: PasswordConfig
	addClients: boolean,
	standarsAttribute: StandarsAttrConfig,
	clients: ClientsConfig[]
}

export interface LambdaStack{
	id: string,
	codePath: string,
	runtime: string,
	handler: string,
	grantReadToDynamo: boolean,
	grantWriteToDynamo: boolean,
}

export interface ApiGatewayStack{
	resources: ResourcesConfig[],
}
export interface S3Stack {
	versioned: boolean,
	publicReadAccess: boolean,
}

export interface CloudFrontStack{
	defaultRootObject?: string,
	certificate : CertificateConfig,
	domainNames: string[]
}
export interface ResourcesConfig{
	resourceName: string,
	methods: string[],
	child: ResourcesConfig[]
}
export interface PasswordConfig{
	minLength: number,
	requireLowercase: boolean,
	requireUppercase: boolean,
	requireDigits: boolean,
	requireSymbols: boolean,
	daysPasswordValidity: number
}
export interface SignInConfig{
	username: boolean,
	email: boolean
}

export interface CertificateConfig{
	enableCertification: boolean,
	certificateArn: string
}

export interface EmailConfig{
	fromEmail: string,
	fromName: string,
	replyTo: string,
}

export interface StandarsAttrConfig{
	emailRequired: boolean,
	emailMutable: boolean,
}

export interface ClientsConfig{
	clientName: string,
	authorizationCodeGrant: boolean,
	callbackUrls: string[],
	logoutUrls: string[],
	generateSecret: boolean,
	authFlows: authFlowsConfig
}

export interface authFlowsConfig{
	userPassword: boolean,
	userSrp: boolean
}
