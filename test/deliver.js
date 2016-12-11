QUnit.module( 'deliver', function () {

  QUnit.test( 'basic', function ( assert ) {

    var A = $.nito( { base: '<div></div>', id: 'a' } );
    var B = $.nito( { id: 'b' } );
    var C = $.nito( {} );

    var $el = A.create( { type: 'A' } );
    $el.mount( B, { type: 'B' } );
    $el.mount( C, { type: 'C' } );
    var html = $el.deliver().outerHtml();

    $el = $( html );
    $el.mount( A );
    $el.mount( B );
    $el.mount( C );

    var data = [];
    $el.eachComp( function () {
      data.push( this.data );
    } );
    assert.deepEqual( data.sort(), [ { type: 'B' }, { type: 'A' }, undefined ] );

  } );

  QUnit.test( 'nested', function ( assert ) {

    var Div = $.nito( {
      base: '<div></div>',
      id: 'div',
      update: function () {
        this.$el.nest( P, this.data, this );
      }
    } );

    var P = $.nito( {
      base: '<p></p>',
      mount: function () {
        this.on( 'test', function () {
          ++test;
        } );
      }
    } );

    var test = 0;

    var $div = Div.create( [ 1, 2, 3 ] );
    var html = $div.deliver().outerHtml();

    $( html ).mount( Div ).eachComp( function () {
      assert.equal( this.data.length, 3 );
      assert.equal( this.find( 'p' ).length, 3 );
      this.find( 'p' ).trigger( 'test' );
      assert.equal( test, 3 );
    } );

  } );

} );
