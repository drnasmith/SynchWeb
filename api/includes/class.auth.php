<?php

	include_once('config.php');

	require_once('lib/jwt/JWT.php');
    use \Firebase\JWT\JWT;


	class Authenticate {
		private $user;

		function __construct($app) {
			$this->app = $app;

			$this->app->post('/authenticate', array(&$this, 'authenticate'))->conditions(array(
				'login' => '[A-z0-9]+',
				'password' => '.*',
			));

			$this->app->get('/authenticate/key', array(&$this, 'generate_jwt_key'));
			$this->app->get('/authenticate/logout', array(&$this, 'logout'));
		}

		function get_user() {
			return $this->user;
		}


		// Check if this request needs authentication
		// We allow some pages unauthorised access based on IP, or calendar hash
		function check_auth_required() {
			global $blsr, $bcr;

			$parts = explode('/', $this->app->request->getResourceUri()); 
		    if (sizeof($parts)) array_shift($parts);

		    $need_auth = true;
		    # Work around to allow beamline sample registration without CAS authentication
		    if (sizeof($parts) >= 2) {
		        if (
		            # For use on the touchscreen computers in the hutch
		            (($parts[0] == 'assign') && in_array($_SERVER["REMOTE_ADDR"], $blsr)) ||
		            (($parts[0] == 'shipment' && $parts[1] == 'containers') && in_array($_SERVER["REMOTE_ADDR"], $blsr)) ||

		            # Calendar ICS export
		            ($parts[0] == 'cal' && $parts[1] == 'ics' && $parts[2] == 'h') || 

		            # Allow barcode reader unauthorised access, same as above, certain IPs only
		            ($parts[0] == 'shipment' && $parts[1] == 'dewars' && in_array($_SERVER["REMOTE_ADDR"], $bcr))
		        ) {
		            $need_auth = false;
		        }
		    }

		    if ($need_auth) $this->check_auth();
		}



		// Generate a new JWT encryption key
		function generate_jwt_key() {
			$this->_output(200, array('key' => base64_encode(openssl_random_pseudo_bytes(64))));
		}


		// Generates a JWT token with the login embedded
		function generate_jwt($login) {
			global $jwt_key;
			$key = base64_decode($jwt_key);

			$now = time();
			$data = array(
		        'iat'  => $now,
		        'jti'  => sha1($login . microtime(true)),//base64_encode(mcrypt_create_iv(32)), 
		        'iss'  => 'http://'.$_SERVER['HTTP_HOST'],
		        'nbf'  => $now + 10,
		        'exp'  => $now + 10 + 60*24,
		        'data' => array(
		            'login' => $login,
		        )
		    );

			$jwt = JWT::encode($data, $jwt_key, 'HS512');
			return array('jwt' => $jwt);
		}


		// Checks any supplied JWT is valid
		function check_auth() {
			global $jwt_key;
			$key = base64_decode($jwt_key);

			$auth_header = $this->app->request->headers->get('authorization');

			if ($auth_header) {
				list($jwt) = sscanf($auth_header, 'Authorization: Bearer %s');

				try {
					$token = JWT::decode($jwt, $secretKey, array('HS512'));
					$this->user = $token->data->login;

				// Invalid token
				} catch (Exception $e) {
					$this->_error(401, 'Invalid token');
				}

			} else {
				$this->_error(401, 'No token provided');
			}
		}



		// Send correct for errors
		function _output($code, $message) {
			$this->app->response->setStatus($code);

			// Cant call $app->halt as app not yet running, just end process
			header(':', true, $code);
       		header('Content-Type: application/json');
			print json_encode($message);
			exit();
		}

		function _error($code, $message) {
			$this->_output($code, array('error' => $message));
		}



		// Calls the relevant Authentication Mechanism
		function authenticate() {
			global $authentication_type;
			if (!$authentication_type) $authentication_type = 'cas';

			// urgh
			$login = $this->app->request->post('login');
			$password = $this->app->request->post('password');

			if (!$login) $this->_error(400, 'No login specified');
			if (!$password) $this->_error(400, 'No password specified');

			$file = "includes/class.auth-${authentication_type}.php";
			if (file_exists($file)) {
				require_once($file);

				$class = strtoupper($authentication_type)."Authentication";
				$auth_handler = new $class();

				if ($auth_handler->authenticate($login, $password)) {
					$this->_output(200, $this->generate_jwt($login));
				} else {
					$this->_error(401, 'Invalid Credentials');
				}
			}

		}


		// Logout
		function logout() {

		}


	}



	// Base Authentication class which any mechanism inherts
	class AuthenticationBase {

	}


	// Authentication Mechanism Interface
	interface Authentication {

		public function authenticate($user, $pass);

		// public function logout();

	}