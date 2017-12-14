import React from 'react'
import FixedHeaderContainer from './FixedHeaderContainer'

export default class A11yTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tableHeaderHeight: null,
      columns: this.props.columns
    }

    this.theadRef = node => (this.theadNode = node)
  }

  componentDidMount () {
    const { height } = this.theadNode.getBoundingClientRect()

    this.setState({ tableHeaderHeight: height })
  }

  render () {
    const { rows, className, columnHeaderClassName } = this.props
    const { Column, Row, Cell } = this.props
    const { columns } = this.state
    const columnNames = [...columns.keys()]

    class FixedContent extends React.Component {
      render () {
        const { fixedRef, style: givenStyle } = this.props
        const style = Object.assign({}, givenStyle, {
          padding: 0,
          margin: 0,
          display: 'flex'
        })

        return (
          <ol ref={fixedRef} style={style}>
            {columnNames.map(columnName => {
              const column = columns.get(columnName)
              const props = {
                key: `${columnName}--fake`,
                className: columnHeaderClassName,
                style: {
                  flex: `0 0 ${column.size}px`
                }
              }

              return <li {...props}>{column.label}</li>
            })}
          </ol>
        )
      }
    }

    const fixedProps = { FixedContent, className, trackX: false }

    return (
      <FixedHeaderContainer {...fixedProps}>
        <table {...this.getTableProps()}>
          <thead ref={this.theadRef} style={{ boxSizing: 'border-box' }}>
            <tr>
              {columnNames.map(columnName => (
                <Column {...this.getColumnProps(columnName)} />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows
              .map(this.getRowProps(columnNames))
              .map(({ publicProps, privateProps }) => (
                <Row {...publicProps}>
                  {privateProps.row
                    .map(this.getCellProps(columnNames, publicProps.rowNo))
                    .map(cellProps => <Cell {...cellProps} />)}
                </Row>
              ))}
          </tbody>
        </table>
      </FixedHeaderContainer>
    )
  }

  get tableWidth () {
    const { columns } = this.state

    return [...columns.values()].reduce((memo, column) => memo + column.size, 0)
  }

  getTableProps () {
    const { tableHeaderHeight } = this.state

    return {
      style: {
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        width: this.tableWidth,
        marginTop: tableHeaderHeight ? `-${tableHeaderHeight}px` : null
      }
    }
  }

  getCellProps (columnNames, rowNo) {
    return (rawData, i) => {
      return {
        key: `${rowNo}_${columnNames[i]}`,
        value: rawData
      }
    }
  }

  getRowProps (columnNames) {
    return (row, i) => {
      const data = row.reduce(
        (memo, cellData, cellIndex) =>
          Object.assign(memo, {
            [columnNames[cellIndex]]: cellData
          }),
        {}
      )

      return {
        publicProps: {
          key: i,
          rowNo: i,
          row: data
        },
        privateProps: {
          row
        }
      }
    }
  }

  getColumnProps (name) {
    const { columnHeaderClassName } = this.props
    const { columns } = this.state

    return {
      key: name,
      column: columns.get(name),
      className: columnHeaderClassName
    }
  }
}
