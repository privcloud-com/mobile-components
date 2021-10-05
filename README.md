![](https://img.shields.io/npm/v/privcloud-mobile-components.svg?style=flat)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

# privcloud-mobile-components

A simple and customizable React Native components for privcloud api service.
- Record List component is to display all records associated to container.
- Record Details component is to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) record details.

## Installation

If using yarn:
```sh
yarn add privcloud-mobile-components
```

If using npm:
```sh
npm install privcloud-mobile-components
```

## Documentation

### Record List component
| Name              | Description                                     | Required    | Default  | Type     |
|-------------------|-------------------------------------------------|-------------|----------|----------|
| token             | Privcloud service API token                     | Yes         |          | String   |
| containerGuid     | Associated container GUID to get all records    | Yes         |          | String   |
| recordTypeId      | Record Type ID to filter records                | Yes         |          | Number   |
| options           | Options to customize a component                | No          | { title: 'Record List', elevation: 3, updatable: false, displayTiming: true }       | Object   |

### Record Details component
| Name              | Description                                     | Required    | Default  | Type     |
|-------------------|-------------------------------------------------|-------------|----------|----------|
| token             | Privcloud service API token                     | Yes         |          | String   |
| guid              | Record GUID to get details. If this is empty, you need to provide **workspaceId** and **containerGuid** to create a new record                      | No          |          | String   |
| workspaceId       | Workspace ID to create a new record             | No         |          | Number   |
| containerGuid     | Container GUID to create a new record           | No          |           | String  |
| transformation    | Transformation type to view record details. **decrypt**, **encrypt**, **anonymize**, **redact**      | No          | 'decrypt' | String  |
| options           | Options to customize a component                | No         | { title: 'Record Details', elevation: 3, displayTiming: true } | Object |

## License

MIT
