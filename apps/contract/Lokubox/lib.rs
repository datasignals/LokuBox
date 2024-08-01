#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod lokubox {
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Lokubox {
        users: Mapping<AccountId, String>, // Mapping of AccountId to username
    }

    impl Lokubox {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                users: Mapping::new(),
            }
        }

        #[ink(message)]
        pub fn sign_up(&mut self, account: AccountId, username: String) -> Result<(), String> {
            if self.users.contains(&account) {
                Err(String::from("User already exists"))
            } else {
                self.users.insert(account, &username);
                Ok(())
            }
        }

        #[ink(message)]
        pub fn is_user(&self, account: AccountId) -> bool {
            self.users.contains(&account)
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::prelude::string::String;

        #[ink::test]
        fn test_new() {
            let contract = Lokubox::new();
            assert_eq!(contract.is_user(AccountId::from([0x01; 32])), false);
        }

        #[ink::test]
        fn test_sign_up() {
            let mut contract = Lokubox::new();
            let account = AccountId::from([0x01; 32]);
            let username = String::from("alice");

            // Sign up new user
            assert_eq!(contract.sign_up(account, username.clone()), Ok(()));
            assert_eq!(contract.is_user(account), true);

            // Check username stored correctly
            assert_eq!(contract.users.get(account), Some(username));

            // Try signing up the same user again
            assert_eq!(
                contract.sign_up(account, String::from("alice")),
                Err(String::from("User already exists"))
            );
        }

        #[ink::test]
        fn test_is_user() {
            let mut contract = Lokubox::new();
            let account = AccountId::from([0x02; 32]);

            // User should not exist initially
            assert_eq!(contract.is_user(account), false);

            // Sign up user
            contract.sign_up(account, String::from("bob")).unwrap();

            // Now user should exist
            assert_eq!(contract.is_user(account), true);
        }
    }


    /// This is how you'd write end-to-end (E2E) or integration tests for ink! contracts.
    ///
    /// When running these you need to make sure that you:
    /// - Compile the tests with the `e2e-tests` feature flag enabled (`--features e2e-tests`)
    /// - Are running a Substrate node which contains `pallet-contracts` in the background
    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;
        use ink_e2e::build_message;
        use std::error::Error;

        type E2EResult<T> = Result<T, Box<dyn Error>>;

        #[ink_e2e::test]
        async fn e2e_test_sign_up(mut client: Client<C, E>) -> E2EResult<()> {
            let constructor = LokuboxRef::new();
            let contract_account_id = client
                .instantiate("lokubox", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            let account = AccountId::from([0x01; 32]);
            let username = "alice".to_string();
            let sign_up = build_message::<LokuboxRef>(contract_account_id.clone())
                .call(move |contract| contract.sign_up(account, username.clone()));  // clone username here
            client.call(&ink_e2e::alice(), sign_up, 0, None).await.expect("sign_up failed");

            let is_user = build_message::<LokuboxRef>(contract_account_id)
                .call(|contract| contract.is_user(account));
            let is_user_result = client.call_dry_run(&ink_e2e::alice(), &is_user, 0, None).await;
            assert!(is_user_result.return_value());

            Ok(())
    
        }

        
    }
}
