/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { CfnKnowledgeBase } from 'aws-cdk-lib/aws-bedrock';

export enum SupplementalDataStorageLocationType {
  /**
     * Contains information about the Amazon S3 location for the extracted images.
     */
  S3 = 'S3',
}

export interface SupplementalDataStorageS3Config {
  /**
     * The S3 URI for the storage location
     */
  readonly uri: string;
}

/**
 * Union type for all possible location configurations
 */
export type SupplementalDataStorageLocationConfig =
    | SupplementalDataStorageS3Config;

/**
 * Represents a supplemental data storage location for images extracted from multimodal documents in your data source.
 */
export class SupplementalDataStorageLocation {
  /**
     * Creates a new S3 supplemental data storage location
     * @param config The configuration for the storage location
     * @returns A new SupplementalDataStorageLocation instance
     */
  public static s3(config: SupplementalDataStorageS3Config): SupplementalDataStorageLocation {
    return new SupplementalDataStorageLocation(
      SupplementalDataStorageLocationType.S3,
      config,
    );
  }

  /**
     * The type of the storage location
     */
  public readonly type: SupplementalDataStorageLocationType;

  /**
     * The configuration for the storage location
     */
  public readonly locationConfig: SupplementalDataStorageLocationConfig;

  /**
     * Creates a new SupplementalDataStorageLocation
     * @param type The type of the storage location
     * @param locationConfig The configuration for the storage location
     */
  constructor(
    type: SupplementalDataStorageLocationType,
    locationConfig: SupplementalDataStorageLocationConfig,
  ) {
    this.type = type;
    this.locationConfig = locationConfig;
  }

  /**
     * Renders as Cfn Property
     * @internal This is an internal core function and should not be called directly.
     */
  public __render(): CfnKnowledgeBase.SupplementalDataStorageLocationProperty {
    if (this.type === SupplementalDataStorageLocationType.S3) {
      const s3Config = this.locationConfig as SupplementalDataStorageS3Config;
      return {
        supplementalDataStorageLocationType: this.type,
        s3Location: {
          uri: s3Config.uri,
        },
      };
    }

    // This should never happen as we only support S3 for now,
    // but TypeScript requires a return statement for all code paths
    throw new Error(`Unsupported storage location type: ${this.type}`);
  }
}