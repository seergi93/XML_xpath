<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <style rel="stylesheet" type="text/css">
                  table{width:100%;border:1px solid}
                  th{background-color:#cdd8f6}
                  td,tr,th{border:1px solid;padding:2px;vertical-align:top}
                  span{color:green;padding-left:5px}
                  #negativo{color:red}
                  #x{color:red}
                </style>
            </head>
            <body>
                <h2>Corrección</h2>
                <table>
                    <tr>
                        <th>Pregunta</th>
                        <th>Opción</th>
                        <th>Respuesta</th>
                    </tr>
                    <xsl:for-each select="questions/question">
                        <tr>
                            <td>
                                <xsl:value-of select="title" />
                            </td>
                            <td>
                                <xsl:for-each select="answer">
                                    <xsl:choose>
                                        <xsl:when test="../type = 'text'">
                                            <span>
                                                <xsl:value-of select="text()" />
                                            </span>
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:for-each>
                                <xsl:for-each select="option">
                                    <xsl:variable name="optposition" select="position()-1" />
                                    Opt
                                    <xsl:value-of select="$optposition+1" />
                                    :
                                    <xsl:value-of select="text()" />
                                    <xsl:for-each select="../answer">
                                        <xsl:variable name="correctanswer" select="text()" />
                                        <xsl:if test="$optposition=$correctanswer">
                                            <span>&#x2713;</span>
                                        </xsl:if>
                                    </xsl:for-each>
                                    <br />
                                    <br />
                                </xsl:for-each>
                            </td>
                            <td>
                                <xsl:for-each select="useranswer">
                                    <xsl:variable name="useranswer" select="text()" />
                                    <xsl:value-of select="text()" />
                                    <xsl:for-each select="../answer">
                                        <xsl:variable name="index" select="position()-1" />
                                        <xsl:variable name="correctanswertext" select="text()" />
                                        <xsl:choose>
                                            <xsl:when test="../type = 'text'">
                                                <xsl:if test="$useranswer=$correctanswertext">
                                                    <span>&#x2713;</span>
                                                </xsl:if>
                                                <xsl:if test="not($useranswer=$correctanswertext)">
                                                    <span id="negativo">&#x2715;</span>
                                                </xsl:if>
                                            </xsl:when>
                                            <xsl:when test="../type = 'select'">
                                                <xsl:if test="$useranswer=$correctanswertext">
                                                    <span>&#x2713;</span>
                                                </xsl:if>
                                                <xsl:if test="not($useranswer=$correctanswertext)">
                                                    <span id="negativo">&#x2715;</span>
                                                </xsl:if>
                                            </xsl:when>
                                            <xsl:when test="../type = 'radio'">
                                                <xsl:if test="$useranswer=$correctanswertext">
                                                    <span>&#x2713;</span>
                                                </xsl:if>
                                                <xsl:if test="not($useranswer=$correctanswertext)">
                                                    <span id="negativo">&#x2715;</span>
                                                </xsl:if>
                                            </xsl:when>
                                            <xsl:when test="../type = 'checkbox'">
                                                <xsl:if test="$useranswer=$correctanswertext">
                                                    <span>&#x2713;</span>
                                                </xsl:if>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:if test="$useranswer=$correctanswertext">
                                                    <span>&#x2713;</span>
                                                </xsl:if>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:for-each>
                                    <br />
                                    <br />
                                </xsl:for-each>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>