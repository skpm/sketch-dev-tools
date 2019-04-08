import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

export const ElementClass = styled.span`
  color: ${props => props.theme.orange};
  padding: 0 0.2rem;
`

export const ElementName = styled.span`
  font-style: italic;
  color: c;
`

export const CompleteElementName = ({ element, hideName }) => (
  <span>
    <ElementClass>{element.class}</ElementClass>
    {!hideName && element.name ? (
      <ElementName> {element.name}</ElementName>
    ) : null}
  </span>
)

CompleteElementName.propTypes = {
  element: PropTypes.shape({
    class: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  hideName: PropTypes.bool,
}
