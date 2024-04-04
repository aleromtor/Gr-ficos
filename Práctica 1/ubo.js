"use strict";

    /*// ==================
    // PREPARING THE UNIFORM BUFFER OBJECT
    // ==================
    // Get the index of the Uniform Block from any program
    const blockIndex = gl.getUniformBlockIndex(shaderProgram.mCompiledShader, "UBO");

    ...
    index = gl.getUniformBlockIndex(shaderProgram.mCompiledShader, "UBO");
    gl.uniformBlockBinding(shaderProgram.mCompiledShader, index, 0);

    index = gl.getUniformBlockIndex(shaderProgramL.mCompiledShader, "UBO");
    gl.uniformBlockBinding(shaderProgramL.mCompiledShader, index, 0);
    */
    
    //let ubo = new UBO( "UBO", shaderProgram, [ "projection", "view" ]);
    //ubo.attachProgram( shaderProgram );
    //ubo.attachProgram( shaderProgramL );

    /*gl.bufferSubData(
            gl.UNIFORM_BUFFER,
            ubo._uboVariableInfo["projection"].offset,
            proj,
            0
        );
        gl.bufferSubData(
            gl.UNIFORM_BUFFER,
            ubo._uboVariableInfo["view"].offset,
            view,
            0
        );*/

    //ubo.uploadData( "projection", proj );
    //ubo.uploadData( "view", view );
    //ubo.uploadAll( );


class UBO {
    constructor(name, program, properties) {
        this._uboVariableInfo = {};
        this._program = program;
        // Get the index of the Uniform Block from any program
        const blockIndex = gl.getUniformBlockIndex(program.mCompiledShader, 
            name);
        const blockSize = gl.getActiveUniformBlockParameter(
            program.mCompiledShader, 
            blockIndex, 
            gl.UNIFORM_BLOCK_DATA_SIZE
        );
        // Creamos el buffer
        this._id = gl.createBuffer();

        // Activamos el buffer
        this.bind();

        // Asignamos un bloque de memoria igual al bloque del UBO
        // DYNAMIC_DRAW: Se van a usar para pintar y se actualizarÃ¡n dinÃ¡micamente
        gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);

        // Desactivamos el buffer
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);

        // Activamos el buffer
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this._id);

        this._getProperties(properties);
    }
    bind() {
        gl.bindBuffer(gl.UNIFORM_BUFFER, this._id);
    }
    _getProperties(uboVariableNames) {
        // Obtenemos el Ã­ndice respectivo de las variables del UBO
        const uboVariableIndices = gl.getUniformIndices(this._program.mCompiledShader, uboVariableNames);
        // Obtenemos el offset en bytes de las variables
        const uboVariableOffsets = gl.getActiveUniforms(this._program.mCompiledShader, uboVariableIndices, gl.UNIFORM_OFFSET);
        // Creamos el objeto donde vamos a mapear cada variable con su Ã­ndice y offset
        uboVariableNames.forEach((name, index) => {
            this._uboVariableInfo[name] = {
                index: uboVariableIndices[index],
                offset: uboVariableOffsets[index],
                data: null,
            };
        });
    }
    attachProgram(prog) {
        let index = gl.getUniformBlockIndex(prog.mCompiledShader, "UBO");
        gl.uniformBlockBinding(prog.mCompiledShader, index, 0);
    }
    uploadData(name, data) {
        this._uboVariableInfo[ name ].data = data;
    }
    uploadSingleData(name, data) {
        gl.bufferSubData(gl.UNIFORM_BUFFER, this._uboVariableInfo[name].offset, data, 0);
    }
    uploadAll( )
    {
        let arr = [ ];
        for( let uvn in this._uboVariableInfo )
        {
            let b = this._uboVariableInfo[ uvn ];
            arr.push( b.data );
        }
        let buff = new Float32Array( arr.map(a => [...a]).flat() );
        gl.bufferData( gl.UNIFORM_BUFFER, buff, gl.DYNAMIC_DRAW);
    }
}