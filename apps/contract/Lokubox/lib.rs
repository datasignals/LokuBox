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
