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

import { ArnFormat, IResource, Resource, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kendra from 'aws-cdk-lib/aws-kendra';
import { IKey } from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import { generatePhysicalNameV2 } from '../../common/helpers/utils';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents a Kendra Index, either created with CDK or imported.
 */
export interface IKendraGenAiIndex extends IResource {
  /**
   * The Amazon Resource Name (ARN) of the index.
   * @example 'arn:aws:kendra:us-east-1:123456789012:index/af04c7ea-22bc-46b7-a65e-6c21e604fc11'
   */
  readonly indexArn: string;

  /**
   * The identifier of the index.
   * @example 'af04c7ea-22bc-46b7-a65e-6c21e604fc11'.
   */
  readonly indexId: string;

  /**
   * An IAM role that gives Amazon Kendra permissions to access
   * your Amazon CloudWatch logs and metrics. This is also the
   * role used when you use the BatchPutDocument operation to index
   * documents from an Amazon S3 bucket.
   */
  readonly role: iam.IRole;
}

export namespace Kendra {
  /**
   * Represents an Amazon Kendra Index Edition.
   */
  export enum Edition {
    DEVELOPER_EDITION = 'DEVELOPER_EDITION',
    ENTERPRISE_EDITION = 'ENTERPRISE_EDITION',
    GEN_AI_ENTERPRISE_EDITION = 'GEN_AI_ENTERPRISE_EDITION',
  }

  /**
   * Represents an Amazon Kendra Index Field Type.
   */
  export enum IndexFieldTypes {
    STRING = 'STRING_VALUE',
    STRING_LIST = 'STRING_LIST_VALUE',
    LONG = 'LONG_VALUE',
    DATE = 'DATE_VALUE',
  }

  /**
   * The different policies available to filter search results based on user context.
   */
  export enum UserContextPolicy {
    /** All indexed content is searchable and displayable for all users.
     * If you want to filter search results on user context, you can use
     * the attribute filters of _user_id and _group_ids or you can provide
     * user and group information in UserContext . */
    ATTRIBUTE_FILTER = 'ATTRIBUTE_FILTER',
    /**
     * Enables token-based user access control to filter search results on
     * user context. All documents with no access control and all documents
     * accessible to the user will be searchable and displayable.
     */
    USER_TOKEN = 'USER_TOKEN',
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a GenAI Index.
 */
export interface KendraGenAiIndexProps {
  /**
   * The name of the index.
   * @default - A name is generated by CDK.
   */
  readonly name?: string;
  /**
   * The identifier of the AWS KMS customer managed key (CMK) to use
   * to encrypt data indexed by Amazon Kendra. Amazon Kendra doesn't support
   * asymmetric CMKs.
   * @default - AWS managed encryption key is used.
   */
  readonly kmsKey?: IKey;
  /**
   * The document capacity units. Every unit increases the baseline capacity by 20,000 documents.
   * E.g. `documentCapacityUnits: 1` means Baseline + 20,000 documents = 40,000 documents
   * @default 0 - baseline capacity of 20,000 documents
   */
  readonly documentCapacityUnits?: number;
  /**
   * The query capacity units. Every unit increases the baseline capacity by 0.1 QPS.
   * E.g. `queryCapacityUnits: 7` means Baseline + 0.1 QPS * 7 = 0.8 QPS
   * @default 0 - baseline capacity of 0.1 QPS
   */
  readonly queryCapacityUnits?: number;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Properties needed for importing an existing Kendra Index.
 */
export interface KendraGenAiIndexAttributes {
  /**
   * The Id of the index.
   * @example 'af04c7ea-22bc-46b7-a65e-6c21e604fc11'
   */
  readonly indexId: string;
  /**
   * An IAM role that gives your Amazon Kendra index permissions.
   */
  readonly role: iam.IRole;
}

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Abstract base class for a Kendra GenAI index.
 * Contains methods and attributes valid for Kendra GenAI Indexes either created with CDK or imported.
 */
export abstract class KendraGenAiIndexBase extends Resource implements IKendraGenAiIndex {
  public abstract readonly indexArn: string;
  public abstract readonly indexId: string;
  public abstract readonly role: iam.IRole;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create a Kendra GenAI Index with CDK.
 * @cloudformationResource AWS::Kendra::Index
 */
export class KendraGenAiIndex extends KendraGenAiIndexBase {
  /**
   * Import a guardrail given its attributes
   */
  public static fromAttrs(scope: Construct, id: string, attrs: KendraGenAiIndexAttributes): IKendraGenAiIndex {
    class Import extends KendraGenAiIndexBase {
      public readonly role = attrs.role;
      public readonly indexId = attrs.indexId;
      public readonly indexArn = Stack.of(this).formatArn({
        service: 'kendra',
        resource: 'index',
        resourceName: attrs.indexId,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      });
    }
    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Properties
  // ------------------------------------------------------
  // inherited
  public readonly indexArn: string;
  public readonly indexId: string;
  public readonly role: iam.IRole;

  /**
   * The edition of the Gen AI index
   */
  public readonly edition: Kendra.Edition = Kendra.Edition.GEN_AI_ENTERPRISE_EDITION;
  /**
   * The name of the Gen AI index
   */
  public readonly name: string;
  /**
   * The AWS KMS key (CMK) used to encrypt data
   */
  public readonly kmsKey?: IKey;
  /**
   * The document capacity units used for the Gen AI index
   */
  public readonly documentCapacityUnits: number;
  /**
   * The query capacity units used for the Gen AI index
   */
  public readonly queryCapacityUnits: number;
  /**
   * The L1 representation of the Kendra Index
   */
  private readonly _resource: kendra.CfnIndex;

  constructor(scope: Construct, id: string, props: KendraGenAiIndexProps) {
    super(scope, id);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    this.name =
      props.name ?? generatePhysicalNameV2(this, 'genai-index', { maxLength: 40, lower: true, separator: '-' });

    this.documentCapacityUnits = props.documentCapacityUnits ?? 0;
    this.queryCapacityUnits = props.queryCapacityUnits ?? 0;
    this.kmsKey = props.kmsKey;

    // ------------------------------------------------------
    // Role Creation
    // ------------------------------------------------------
    const roleName = generatePhysicalNameV2(this, `AmazonKendraRoleForIndex-${this.name}`, { maxLength: 64 });
    this.role = new iam.Role(this, 'Role', {
      roleName: roleName,
      assumedBy: new iam.ServicePrincipal('kendra.amazonaws.com'),
    });
    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['logs:DescribeLogGroups'],
        resources: ['*'],
      }),
    );
    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['cloudwatch:PutMetricData'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'cloudwatch:namespace': 'AWS/Kendra',
          },
        },
      }),
    );
    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['logs:CreateLogGroup'],
        resources: [
          Stack.of(this).formatArn({
            service: 'logs',
            resource: 'log-group',
            resourceName: '/aws/kendra/*',
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          }),
        ],
      }),
    );
    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['logs:DescribeLogStreams', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: [
          Stack.of(this).formatArn({
            service: 'logs',
            resource: 'log-group',
            resourceName: '/aws/kendra/*:log-stream:*',
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          }),
        ],
      }),
    );

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this._resource = new kendra.CfnIndex(this, 'GenAiIndex', {
      name: this.name,
      edition: Kendra.Edition.GEN_AI_ENTERPRISE_EDITION,
      roleArn: this.role.roleArn,
      serverSideEncryptionConfiguration: props.kmsKey
        ? {
          kmsKeyId: props.kmsKey.keyId,
        }
        : undefined,
      capacityUnits: {
        storageCapacityUnits: this.documentCapacityUnits,
        queryCapacityUnits: this.queryCapacityUnits,
      },
      userContextPolicy: Kendra.UserContextPolicy.ATTRIBUTE_FILTER,
    });

    this.indexArn = this._resource.attrArn;
    this.indexId = this._resource.attrId;
  }
}
