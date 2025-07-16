/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/provider.json`.
 */
export type Provider = {
  "address": "BfHgyDmEcrmt2GyQ1ypLcopsKUJXp4zo86y3TnKffuLz",
  "metadata": {
    "name": "provider",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Overlock Provider"
  },
  "instructions": [
    {
      "name": "registerProvider",
      "discriminator": [
        254,
        209,
        54,
        184,
        46,
        197,
        109,
        78
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "provider",
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
          "name": "ip",
          "type": "string"
        },
        {
          "name": "port",
          "type": "u16"
        },
        {
          "name": "country",
          "type": "string"
        },
        {
          "name": "environmentType",
          "type": "string"
        },
        {
          "name": "availability",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "provider",
      "discriminator": [
        164,
        180,
        71,
        17,
        75,
        216,
        80,
        195
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
      "name": "provider",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "ip",
            "type": "string"
          },
          {
            "name": "port",
            "type": "u16"
          },
          {
            "name": "country",
            "type": "string"
          },
          {
            "name": "environmentType",
            "type": "string"
          },
          {
            "name": "availability",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
