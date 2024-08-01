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

        
    }
}
