import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {consentledger} from './consentledger';

const meta: Meta<typeof consentledger> = {
  component: consentledger,
};

export default meta;

type Story = StoryObj<typeof consentledger>;

export const Basic: Story = {args: {}};
