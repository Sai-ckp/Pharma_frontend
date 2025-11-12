import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {unitofmeasurement} from './unitofmeasurement';

const meta: Meta<typeof unitofmeasurement> = {
  component: unitofmeasurement,
};

export default meta;

type Story = StoryObj<typeof unitofmeasurement>;

export const Basic: Story = {args: {}};
