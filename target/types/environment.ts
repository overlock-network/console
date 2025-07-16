/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/environment.json`.
 */
export type Environment = {
  "address": "F6MJX57V1LjRHxF6a7zbJGT8MyQfYAv8jrDZ8DnXpgtV",
  "metadata": {
    "name": "environment",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createEnvironment",
      "discriminator": [
        91,
        139,
        15,
        73,
        98,
        77,
        130,
        106
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "environment",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "owner",
          "type": "pubkey"
        },
        {
          "name": "provider",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "environment",
      "discriminator": [
        88,
        165,
        23,
        131,
        113,
        201,
        162,
        120
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "customError",
      "msg": "Custom error message"
    }
  ],
  "types": [
    {
      "name": "environment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "provider",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
