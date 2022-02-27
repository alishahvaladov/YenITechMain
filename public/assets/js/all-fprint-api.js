const fPrintType = document.querySelector("#fPrintType");
const loading = document.querySelector(".loading");
const tbody = document.querySelector("tbody");
const pgContainer = document.querySelector(".pagination-container");
const thead = document.querySelector(".headers");
const inputs = document.querySelector(".inputs");
const thForFPrintsAndAllFPrints = `
    <th>Əməkdaş</th>
    <th>Proyekt</th>
    <th>Departament</th>
    <th>Vəzifə</th>
    <th>Barmaq izi(vaxtı)</th>
    <th>Tarix</th>
    <th>
        <button id="fpUploadBtn" class="btn btn-outline-success btn-sm" type="button">Logix yüklə</button>
    </th>
`;
const thForNoFPrints = `
    <th>Əməkdaş</th>
    <th>Proyekt</th>
    <th>Departament</th>
    <th>Vəzifə</th>
    <th>Giriş</th>
    <th>Çıxış</th>
    <th>Tarix</th>
    <th>
        <a class="btn btn-outline-success btn-sm" href="/nofprint/add-nofprint"><i class="bi bi-plus-circle"></i></a>
    </th>
`;
const thForInappropriateFPrints = `
    <th>Əməkdaş</th>
    <th>Barmaq izi tarixi</th>
    <th>Giriş</th>
    <th>Çıxış</th>
`;
const inputThForNoFPrints = `
    <th><input type="text" name="qEmployee" id="qEmployee"></th>
                <th><input type="text" name="qProject" id="qProject"></th>
                <th><input type="text" name="qDepartment" id="qDepartment"></th>
                <th><input type="text" name="qPosition" id="qPosition"></th>
                <th><input type="text" name="qTimeEnter" id="qTimeEnter"></th>
                <th><input type="text" name="qTimeLeave" id="qTimeLeave"></th>
                <th class="d-flex justify-content-between">
                    <span>
                         <select id="day" name="day">
                             <option value="gun" hidden>Gün</option>
                             <option value="00">Bütün</option>
                             <option value="01">1</option>
                             <option value="02">2</option>
                             <option value="03">3</option>
                             <option value="04">4</option>
                             <option value="05">5</option>
                             <option value="06">6</option>
                             <option value="07">7</option>
                             <option value="08">8</option>
                             <option value="09">9</option>
                             <option value="10">10</option>
                             <option value="11">11</option>
                             <option value="12">12</option>
                             <option value="13">13</option>
                             <option value="14">14</option>
                             <option value="15">15</option>
                             <option value="16">16</option>
                             <option value="17">17</option>
                             <option value="18">18</option>
                             <option value="19">19</option>
                             <option value="20">20</option>
                             <option value="21">21</option>
                             <option value="22">22</option>
                             <option value="23">23</option>
                             <option value="24">24</option>
                             <option value="25">25</option>
                             <option value="26">26</option>
                             <option value="27">27</option>
                             <option value="28">28</option>
                             <option value="29">29</option>
                             <option value="30">30</option>
                             <option value="31">31</option>
                         </select>
                    </span>
                    <span>
                        <select id="month" name="month">
                            <option value="ay" hidden>Ay</option>
                            <option value="00">Bütün</option>
                            <option value="01">Yanvar</option>
                            <option value="02">Fevral</option>
                            <option value="03">Mart</option>
                            <option value="04">Aprel</option>
                            <option value="05">May</option>
                            <option value="06">İyun</option>
                            <option value="07">İyul</option>
                            <option value="08">Avqust</option>
                            <option value="09">Sentyabr</option>
                            <option value="10">Oktyabr</option>
                            <option value="11">Noyabr</option>
                            <option value="12">Dekabr</option>
                        </select>
                    </span>
                    <span>
                         <select id="year" name="year">
                             <option value="il" hidden>İl</option>
                             <option value="00">Bütün</option>
                             <option value="2021">2021</option>
                             <option value="2020">2020</option>
                             <option value="2019">2019</option>
                             <option value="2018">2018</option>
                             <option value="2017">2017</option>
                             <option value="2016">2016</option>
                             <option value="2015">2015</option>
                             <option value="2014">2014</option>
                             <option value="2013">2013</option>
                             <option value="2012">2012</option>
                             <option value="2011">2011</option>
                             <option value="2010">2010</option>
                             <option value="2009">2009</option>
                             <option value="2008">2008</option>
                             <option value="2007">2007</option>
                             <option value="2006">2006</option>
                             <option value="2005">2005</option>
                             <option value="2004">2004</option>
                             <option value="2003">2003</option>
                             <option value="2002">2002</option>
                             <option value="2001">2001</option>
                             <option value="2000">2000</option>
                             <option value="1999">1999</option>
                             <option value="1998">1998</option>
                             <option value="1997">1997</option>
                             <option value="1996">1996</option>
                             <option value="1995">1995</option>
                             <option value="1994">1994</option>
                             <option value="1993">1993</option>
                             <option value="1992">1992</option>
                             <option value="1991">1991</option>
                             <option value="1990">1990</option>
                             <option value="1989">1989</option>
                             <option value="1988">1988</option>
                             <option value="1987">1987</option>
                             <option value="1986">1986</option>
                             <option value="1985">1985</option>
                             <option value="1984">1984</option>
                             <option value="1983">1983</option>
                             <option value="1982">1982</option>
                             <option value="1981">1981</option>
                             <option value="1980">1980</option>
                             <option value="1979">1979</option>
                             <option value="1978">1978</option>
                             <option value="1977">1977</option>
                             <option value="1976">1976</option>
                             <option value="1975">1975</option>
                             <option value="1974">1974</option>
                             <option value="1973">1973</option>
                             <option value="1972">1972</option>
                             <option value="1971">1971</option>
                             <option value="1970">1970</option>
                             <option value="1969">1969</option>
                             <option value="1968">1968</option>
                             <option value="1967">1967</option>
                             <option value="1966">1966</option>
                             <option value="1965">1965</option>
                             <option value="1964">1964</option>
                             <option value="1963">1963</option>
                             <option value="1962">1962</option>
                             <option value="1961">1961</option>
                             <option value="1960">1960</option>
                             <option value="1959">1959</option>
                             <option value="1958">1958</option>
                             <option value="1957">1957</option>
                             <option value="1956">1956</option>
                             <option value="1955">1955</option>
                             <option value="1954">1954</option>
                             <option value="1953">1953</option>
                             <option value="1952">1952</option>
                             <option value="1951">1951</option>
                             <option value="1950">1950</option>
                             <option value="1949">1949</option>
                             <option value="1948">1948</option>
                             <option value="1947">1947</option>
                             <option value="1946">1946</option>
                             <option value="1945">1945</option>
                             <option value="1944">1944</option>
                             <option value="1943">1943</option>
                             <option value="1942">1942</option>
                             <option value="1941">1941</option>
                             <option value="1940">1940</option>
                             <option value="1939">1939</option>
                             <option value="1938">1938</option>
                             <option value="1937">1937</option>
                             <option value="1936">1936</option>
                             <option value="1935">1935</option>
                             <option value="1934">1934</option>
                             <option value="1933">1933</option>
                             <option value="1932">1932</option>
                             <option value="1931">1931</option>
                             <option value="1930">1930</option>
                             <option value="1929">1929</option>
                             <option value="1928">1928</option>
                             <option value="1927">1927</option>
                             <option value="1926">1926</option>
                             <option value="1925">1925</option>
                             <option value="1924">1924</option>
                             <option value="1923">1923</option>
                             <option value="1922">1922</option>
                             <option value="1921">1921</option>
                             <option value="1920">1920</option>
                             <option value="1919">1919</option>
                             <option value="1918">1918</option>
                             <option value="1917">1917</option>
                             <option value="1916">1916</option>
                             <option value="1915">1915</option>
                             <option value="1914">1914</option>
                             <option value="1913">1913</option>
                             <option value="1912">1912</option>
                             <option value="1911">1911</option>
                             <option value="1910">1910</option>
                             <option value="1909">1909</option>
                             <option value="1908">1908</option>
                             <option value="1907">1907</option>
                             <option value="1906">1906</option>
                             <option value="1905">1905</option>
                             <option value="1904">1904</option>
                             <option value="1903">1903</option>
                             <option value="1902">1902</option>
                             <option value="1901">1901</option>
                             <option value="1900">1900</option>
                         </select>
                    </span>
                </th>
                <th>
                     <button class="btn btn-success btn-sm w-100" id="exportAllFPrint"><i class="bi bi-file-earmark-excel-fill"></i> Export</button>
                </th>

`
const inputThForFPrintsAndAllFPrints = `
    <th><input type="text" name="qEmployee" id="qEmployee"></th>
                <th><input type="text" name="qProject" id="qProject"></th>
                <th><input type="text" name="qDepartment" id="qDepartment"></th>
                <th><input type="text" name="qPosition" id="qPosition"></th>
                <th><input type="text" name="qTime" id="qTime"></th>
                <th class="d-flex justify-content-between">
                    <span>
                         <select id="day" name="day">
                             <option value="gun" hidden>Gün</option>
                             <option value="00">Bütün</option>
                             <option value="01">1</option>
                             <option value="02">2</option>
                             <option value="03">3</option>
                             <option value="04">4</option>
                             <option value="05">5</option>
                             <option value="06">6</option>
                             <option value="07">7</option>
                             <option value="08">8</option>
                             <option value="09">9</option>
                             <option value="10">10</option>
                             <option value="11">11</option>
                             <option value="12">12</option>
                             <option value="13">13</option>
                             <option value="14">14</option>
                             <option value="15">15</option>
                             <option value="16">16</option>
                             <option value="17">17</option>
                             <option value="18">18</option>
                             <option value="19">19</option>
                             <option value="20">20</option>
                             <option value="21">21</option>
                             <option value="22">22</option>
                             <option value="23">23</option>
                             <option value="24">24</option>
                             <option value="25">25</option>
                             <option value="26">26</option>
                             <option value="27">27</option>
                             <option value="28">28</option>
                             <option value="29">29</option>
                             <option value="30">30</option>
                             <option value="31">31</option>
                         </select>
                    </span>
                    <span>
                        <select id="month" name="month">
                            <option value="ay" hidden>Ay</option>
                            <option value="00">Bütün</option>
                            <option value="01">Yanvar</option>
                            <option value="02">Fevral</option>
                            <option value="03">Mart</option>
                            <option value="04">Aprel</option>
                            <option value="05">May</option>
                            <option value="06">İyun</option>
                            <option value="07">İyul</option>
                            <option value="08">Avqust</option>
                            <option value="09">Sentyabr</option>
                            <option value="10">Oktyabr</option>
                            <option value="11">Noyabr</option>
                            <option value="12">Dekabr</option>
                        </select>
                    </span>
                    <span>
                         <select id="year" name="year">
                             <option value="il" hidden>İl</option>
                             <option value="00">Bütün</option>
                             <option value="2021">2021</option>
                             <option value="2020">2020</option>
                             <option value="2019">2019</option>
                             <option value="2018">2018</option>
                             <option value="2017">2017</option>
                             <option value="2016">2016</option>
                             <option value="2015">2015</option>
                             <option value="2014">2014</option>
                             <option value="2013">2013</option>
                             <option value="2012">2012</option>
                             <option value="2011">2011</option>
                             <option value="2010">2010</option>
                             <option value="2009">2009</option>
                             <option value="2008">2008</option>
                             <option value="2007">2007</option>
                             <option value="2006">2006</option>
                             <option value="2005">2005</option>
                             <option value="2004">2004</option>
                             <option value="2003">2003</option>
                             <option value="2002">2002</option>
                             <option value="2001">2001</option>
                             <option value="2000">2000</option>
                             <option value="1999">1999</option>
                             <option value="1998">1998</option>
                             <option value="1997">1997</option>
                             <option value="1996">1996</option>
                             <option value="1995">1995</option>
                             <option value="1994">1994</option>
                             <option value="1993">1993</option>
                             <option value="1992">1992</option>
                             <option value="1991">1991</option>
                             <option value="1990">1990</option>
                             <option value="1989">1989</option>
                             <option value="1988">1988</option>
                             <option value="1987">1987</option>
                             <option value="1986">1986</option>
                             <option value="1985">1985</option>
                             <option value="1984">1984</option>
                             <option value="1983">1983</option>
                             <option value="1982">1982</option>
                             <option value="1981">1981</option>
                             <option value="1980">1980</option>
                             <option value="1979">1979</option>
                             <option value="1978">1978</option>
                             <option value="1977">1977</option>
                             <option value="1976">1976</option>
                             <option value="1975">1975</option>
                             <option value="1974">1974</option>
                             <option value="1973">1973</option>
                             <option value="1972">1972</option>
                             <option value="1971">1971</option>
                             <option value="1970">1970</option>
                             <option value="1969">1969</option>
                             <option value="1968">1968</option>
                             <option value="1967">1967</option>
                             <option value="1966">1966</option>
                             <option value="1965">1965</option>
                             <option value="1964">1964</option>
                             <option value="1963">1963</option>
                             <option value="1962">1962</option>
                             <option value="1961">1961</option>
                             <option value="1960">1960</option>
                             <option value="1959">1959</option>
                             <option value="1958">1958</option>
                             <option value="1957">1957</option>
                             <option value="1956">1956</option>
                             <option value="1955">1955</option>
                             <option value="1954">1954</option>
                             <option value="1953">1953</option>
                             <option value="1952">1952</option>
                             <option value="1951">1951</option>
                             <option value="1950">1950</option>
                             <option value="1949">1949</option>
                             <option value="1948">1948</option>
                             <option value="1947">1947</option>
                             <option value="1946">1946</option>
                             <option value="1945">1945</option>
                             <option value="1944">1944</option>
                             <option value="1943">1943</option>
                             <option value="1942">1942</option>
                             <option value="1941">1941</option>
                             <option value="1940">1940</option>
                             <option value="1939">1939</option>
                             <option value="1938">1938</option>
                             <option value="1937">1937</option>
                             <option value="1936">1936</option>
                             <option value="1935">1935</option>
                             <option value="1934">1934</option>
                             <option value="1933">1933</option>
                             <option value="1932">1932</option>
                             <option value="1931">1931</option>
                             <option value="1930">1930</option>
                             <option value="1929">1929</option>
                             <option value="1928">1928</option>
                             <option value="1927">1927</option>
                             <option value="1926">1926</option>
                             <option value="1925">1925</option>
                             <option value="1924">1924</option>
                             <option value="1923">1923</option>
                             <option value="1922">1922</option>
                             <option value="1921">1921</option>
                             <option value="1920">1920</option>
                             <option value="1919">1919</option>
                             <option value="1918">1918</option>
                             <option value="1917">1917</option>
                             <option value="1916">1916</option>
                             <option value="1915">1915</option>
                             <option value="1914">1914</option>
                             <option value="1913">1913</option>
                             <option value="1912">1912</option>
                             <option value="1911">1911</option>
                             <option value="1910">1910</option>
                             <option value="1909">1909</option>
                             <option value="1908">1908</option>
                             <option value="1907">1907</option>
                             <option value="1906">1906</option>
                             <option value="1905">1905</option>
                             <option value="1904">1904</option>
                             <option value="1903">1903</option>
                             <option value="1902">1902</option>
                             <option value="1901">1901</option>
                             <option value="1900">1900</option>
                         </select>
                    </span>
                </th>
                <th>
                     <button class="btn btn-success btn-sm w-100" id="exportAllFPrint"><i class="bi bi-file-earmark-excel-fill"></i> Export</button>
                </th>
`;
const inputThForInappropriateFPrints = `
            <th><input type="text" name="qProject" id="qProject"></th>
            <th class="d-flex justify-content-between">
                <span>
                     <select id="day" name="day">
                         <option value="gun" hidden>Gün</option>
                         <option value="00">Bütün</option>
                         <option value="01">1</option>
                         <option value="02">2</option>
                         <option value="03">3</option>
                         <option value="04">4</option>
                         <option value="05">5</option>
                         <option value="06">6</option>
                         <option value="07">7</option>
                         <option value="08">8</option>
                         <option value="09">9</option>
                         <option value="10">10</option>
                         <option value="11">11</option>
                         <option value="12">12</option>
                         <option value="13">13</option>
                         <option value="14">14</option>
                         <option value="15">15</option>
                         <option value="16">16</option>
                         <option value="17">17</option>
                         <option value="18">18</option>
                         <option value="19">19</option>
                         <option value="20">20</option>
                         <option value="21">21</option>
                         <option value="22">22</option>
                         <option value="23">23</option>
                         <option value="24">24</option>
                         <option value="25">25</option>
                         <option value="26">26</option>
                         <option value="27">27</option>
                         <option value="28">28</option>
                         <option value="29">29</option>
                         <option value="30">30</option>
                         <option value="31">31</option>
                     </select>
                </span>
                <span>
                    <select id="month" name="month">
                        <option value="ay" hidden>Ay</option>
                        <option value="00">Bütün</option>
                        <option value="01">Yanvar</option>
                        <option value="02">Fevral</option>
                        <option value="03">Mart</option>
                        <option value="04">Aprel</option>
                        <option value="05">May</option>
                        <option value="06">İyun</option>
                        <option value="07">İyul</option>
                        <option value="08">Avqust</option>
                        <option value="09">Sentyabr</option>
                        <option value="10">Oktyabr</option>
                        <option value="11">Noyabr</option>
                        <option value="12">Dekabr</option>
                    </select>
                </span>
                <span>
                     <select id="year" name="year">
                         <option value="il" hidden>İl</option>
                         <option value="00">Bütün</option>
                         <option value="2021">2021</option>
                         <option value="2020">2020</option>
                         <option value="2019">2019</option>
                         <option value="2018">2018</option>
                         <option value="2017">2017</option>
                         <option value="2016">2016</option>
                         <option value="2015">2015</option>
                         <option value="2014">2014</option>
                         <option value="2013">2013</option>
                         <option value="2012">2012</option>
                         <option value="2011">2011</option>
                         <option value="2010">2010</option>
                         <option value="2009">2009</option>
                         <option value="2008">2008</option>
                         <option value="2007">2007</option>
                         <option value="2006">2006</option>
                         <option value="2005">2005</option>
                         <option value="2004">2004</option>
                         <option value="2003">2003</option>
                         <option value="2002">2002</option>
                         <option value="2001">2001</option>
                         <option value="2000">2000</option>
                         <option value="1999">1999</option>
                         <option value="1998">1998</option>
                         <option value="1997">1997</option>
                         <option value="1996">1996</option>
                         <option value="1995">1995</option>
                         <option value="1994">1994</option>
                         <option value="1993">1993</option>
                         <option value="1992">1992</option>
                         <option value="1991">1991</option>
                         <option value="1990">1990</option>
                         <option value="1989">1989</option>
                         <option value="1988">1988</option>
                         <option value="1987">1987</option>
                         <option value="1986">1986</option>
                         <option value="1985">1985</option>
                         <option value="1984">1984</option>
                         <option value="1983">1983</option>
                         <option value="1982">1982</option>
                         <option value="1981">1981</option>
                         <option value="1980">1980</option>
                         <option value="1979">1979</option>
                         <option value="1978">1978</option>
                         <option value="1977">1977</option>
                         <option value="1976">1976</option>
                         <option value="1975">1975</option>
                         <option value="1974">1974</option>
                         <option value="1973">1973</option>
                         <option value="1972">1972</option>
                         <option value="1971">1971</option>
                         <option value="1970">1970</option>
                         <option value="1969">1969</option>
                         <option value="1968">1968</option>
                         <option value="1967">1967</option>
                         <option value="1966">1966</option>
                         <option value="1965">1965</option>
                         <option value="1964">1964</option>
                         <option value="1963">1963</option>
                         <option value="1962">1962</option>
                         <option value="1961">1961</option>
                         <option value="1960">1960</option>
                         <option value="1959">1959</option>
                         <option value="1958">1958</option>
                         <option value="1957">1957</option>
                         <option value="1956">1956</option>
                         <option value="1955">1955</option>
                         <option value="1954">1954</option>
                         <option value="1953">1953</option>
                         <option value="1952">1952</option>
                         <option value="1951">1951</option>
                         <option value="1950">1950</option>
                         <option value="1949">1949</option>
                         <option value="1948">1948</option>
                         <option value="1947">1947</option>
                         <option value="1946">1946</option>
                         <option value="1945">1945</option>
                         <option value="1944">1944</option>
                         <option value="1943">1943</option>
                         <option value="1942">1942</option>
                         <option value="1941">1941</option>
                         <option value="1940">1940</option>
                         <option value="1939">1939</option>
                         <option value="1938">1938</option>
                         <option value="1937">1937</option>
                         <option value="1936">1936</option>
                         <option value="1935">1935</option>
                         <option value="1934">1934</option>
                         <option value="1933">1933</option>
                         <option value="1932">1932</option>
                         <option value="1931">1931</option>
                         <option value="1930">1930</option>
                         <option value="1929">1929</option>
                         <option value="1928">1928</option>
                         <option value="1927">1927</option>
                         <option value="1926">1926</option>
                         <option value="1925">1925</option>
                         <option value="1924">1924</option>
                         <option value="1923">1923</option>
                         <option value="1922">1922</option>
                         <option value="1921">1921</option>
                         <option value="1920">1920</option>
                         <option value="1919">1919</option>
                         <option value="1918">1918</option>
                         <option value="1917">1917</option>
                         <option value="1916">1916</option>
                         <option value="1915">1915</option>
                         <option value="1914">1914</option>
                         <option value="1913">1913</option>
                         <option value="1912">1912</option>
                         <option value="1911">1911</option>
                         <option value="1910">1910</option>
                         <option value="1909">1909</option>
                         <option value="1908">1908</option>
                         <option value="1907">1907</option>
                         <option value="1906">1906</option>
                         <option value="1905">1905</option>
                         <option value="1904">1904</option>
                         <option value="1903">1903</option>
                         <option value="1902">1902</option>
                         <option value="1901">1901</option>
                         <option value="1900">1900</option>
                     </select>
                </span>
            </th>
            <th><input type="text" name="qDepartment" id="qDepartment"></th>
            <th><input type="text" name="qPosition" id="qPosition"></th>
`;
const tr = `
    <tr>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold"></td>
    </tr>
`
const trForNoFPrints = `
    <tr>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold"></td>
    </tr>
`;
const trForInappropriateFPrints = `
    <tr>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
        <td class="bg-warning bg-opacity-50 text-black bold">Waiting</td>
    </tr>
`;

const renderAllFPrint = () => {
    const qEmp = $("#qEmployee");
    const qProj = $("#qProject");
    const qDept = $("#qDepartment");
    const qPos = $("#qPosition");
    const qTime = $("#qTime");
    const qDay = $("#day");
    const qMonth = $("#month");
    const qYear = $("#year");


    const pgContatiner = document.querySelector(".pagination-container");
    const loading = document.querySelector(".loading");

    const pageFunctions = () => {
        let pgItems = document.querySelectorAll('.pagination-item');
        let fTDots = document.querySelector('.fTDots');
        let lTDots = document.querySelector('.lTDots');
        pgItems = Array.from(pgItems);
        pgItems.forEach(item => {
            item.addEventListener("click", () => {
                loading.classList.remove('d-none');
                let offset = parseInt(item.value) - 1;
                let activeClass = document.querySelector('.active');
                let index = pgItems.indexOf(activeClass);
                pgItems[index].classList.remove('active');
                item.classList.add('active');
                activeClass = document.querySelector('.active');
                index = pgItems.indexOf(activeClass);
                if(pgItems.length > 21) {
                    if(index > 9 && index < pgItems.length - 10) {
                        fTDots.classList.remove('d-none');
                        lTDots.classList.remove('d-none');
                        for(let i = 1; i < pgItems.length - 1; i++) {
                            pgItems[i].classList.add('d-none');
                        }
                        for (let i = index; i > index - 9; i--) {
                            if (i < 1) {
                                break;
                            }
                            pgItems[i].classList.remove('d-none')
                        }
                        for (let i = index; i < index + 9; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    } else if (index <= 9) {
                        fTDots.classList.add('d-none');
                        lTDots.classList.remove('d-none');
                        for (let i = 21; i < pgItems.length - 2; i++) {
                            pgItems[i].classList.add('d-none')
                        }
                        for (let i = 1; i < 21; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    } else {
                        lTDots.classList.add('d-none');
                        fTDots.classList.remove('d-none');
                        for (let i = 1; i < pgItems.length - 20; i++) {
                            pgItems[i].classList.add('d-none');
                        }
                        for (let i = pgItems.length - 22; i < pgItems.length - 1; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    }
                }
                setTimeout(() => {
                    let qEmp = $("#qEmployee").val();
                    let qProj = $("#qProject").val();
                    let qDept = $("#qDepartment").val();
                    let qPos = $("#qPosition").val();
                    let qTime = $("#qTime").val();
                    let qDay = $("#day").val();
                    let qMonth = $("#month").val();
                    let qYear = $("#year").val();

                    $.post('http://localhost:3000/all-fprints/api', {
                        qEmployee: qEmp,
                        qProject: qProj,
                        qDepartment: qDept,
                        qPosition: qPos,
                        qTime: qTime,
                        qDay: qDay,
                        qMonth: qMonth,
                        qYear: qYear,
                        offset: offset
                    }, (res) => {
                        let tbody = $("tbody");
                        let trs = "";
                        tbody.text("");
                        let fprints = res.result.fprints;
                        console.log(fprints);
                        for (let i = 0; i < fprints.length; i++) {
                            const date = new Date(fprints[i].date);
                            let time = [];
                            if(fprints[i].date) {
                                time = fprints[i].time.split(':');
                                time = time[0] + ":" + time[1];
                            }
                            let createdAt = date.toLocaleDateString();
                            createdAt = createdAt.split('/');
                            let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                            trs +=
                                `
                    <tr>
                        <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                        <td>${fprints[i].projName}</td>
                        <td>${fprints[i].deptName}</td>
                        <td>${fprints[i].posName}</td>
                        <td>${time}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                        }
                        if(trs.length !== 0) {
                            tbody.html(trs);
                        } else {
                            tbody.text("No Data Found");
                        }
                        loading.classList.add('d-none');
                    });
                }, 1000);
            });
        });
    }

    const renderPage = () => {
        let qEmp = $("#qEmployee").val();
        let qProj = $("#qProject").val();
        let qDept = $("#qDepartment").val();
        let qPos = $("#qPosition").val();
        let qTime = $("#qTime").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();
        let offset = 0;

        console.log(qEmp);
        console.log(offset);

        $.post("http://localhost:3000/all-fprints/api", {
                qEmployee: qEmp,
                qProject: qProj,
                qDepartment: qDept,
                qPosition: qPos,
                qTime: qTime,
                qDay: qDay,
                qMonth: qMonth,
                qYear: qYear,
                offset: offset
            },
            (res) => {
                console.log(res)
                let fprints = res.result.fprints;
                let count = res.result.count;
                let html = '';
                count = Math.ceil(count / 15);

                for (let i = 1; i <= count; i++) {
                    if (i === 1) {
                        html += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
                        html += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                    } if (i > 21 && i < count) {
                        html += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    } else if (i !== 1 && i !== count) {
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                    if (i === count) {
                        if(count > 21) {
                            html += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                        }
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                }
                pgContatiner.innerHTML = html;
                console.log(fprints)
                let tbody = $("tbody");
                let trs = "";
                tbody.text("");
                for (let i = 0; i < fprints.length; i++) {
                    const date = new Date(fprints[i].date);
                    let time = fprints[i].time.split(':');
                    time = time[0] + ":" + time[1];
                    let createdAt = date.toLocaleDateString();
                    createdAt = createdAt.split('/');
                    let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                    trs +=
                        `
                    <tr>
                        <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                        <td>${fprints[i].projName}</td>
                        <td>${fprints[i].deptName}</td>
                        <td>${fprints[i].posName}</td>
                        <td>${time}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                }
                if(trs.length !== 0) {
                    tbody.html(trs);
                } else {
                    tbody.text("No Data Found");
                }
                loading.classList.add('d-none');
                pageFunctions();
            });
    } 
    
    const exportToExcel = () => {
        let qEmployee = $("#qEmployee").val();
        let qProject = $("#qProject").val();
        let qDepartment = $("#qDepartment").val();
        let qPosition = $("#qPosition").val();
        let qTime = $("#qTime").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();

        const method = "post";
        let params = {
            qEmployee,
            qProject,
            qDepartment,
            qPosition,
            qTime,
            qDay,
            qMonth,
            qYear,
            limit: "all"
        }
        let form = document.createElement('form');
        form.setAttribute("method", method);
        form.setAttribute("action", "http://localhost:3000/all-fprints/api/excel-report");
     
        for (let key in params) {
           if (params.hasOwnProperty(key)) {
              const hiddenField = document.createElement("input");
              hiddenField.setAttribute('type', 'hidden');
              hiddenField.setAttribute('name', key);
              hiddenField.setAttribute('value', params[key]);
              form.appendChild(hiddenField);
           }
        }
        document.body.appendChild(form);
        form.submit();
     }
     const exportAllFPrint = document.querySelector("#exportAllFPrint");

     exportAllFPrint.addEventListener("click", () => {
        exportToExcel()
    });
    setTimeout(renderPage, 2500);

    qEmp.keyup(renderPage)
    qProj.keyup(renderPage)
    qDept.keyup(renderPage)
    qPos.keyup(renderPage)
    qTime.keyup(renderPage)
    qDay.change(renderPage)
    qMonth.change(renderPage)
    qYear.change(renderPage)


}
const renderFPrint = () => {
    const qEmp = $("#qEmployee");
    const qProj = $("#qProject");
    const qDept = $("#qDepartment");
    const qPos = $("#qPosition");
    const qTime = $("#qTime");
    const qDay = $("#day");
    const qMonth = $("#month");
    const qYear = $("#year");

    const pgContatiner = document.querySelector(".pagination-container");
    const loading = document.querySelector(".loading");

    const pageFunctions = () => {
        let pgItems = document.querySelectorAll('.pagination-item');
        let fTDots = document.querySelector('.fTDots');
        let lTDots = document.querySelector('.lTDots');
        pgItems = Array.from(pgItems);
        pgItems.forEach(item => {
            item.addEventListener("click", () => {
                loading.classList.remove('d-none');
                let offset = parseInt(item.value) - 1;
                let activeClass = document.querySelector('.active');
                let index = pgItems.indexOf(activeClass);
                pgItems[index].classList.remove('active');
                item.classList.add('active');
                activeClass = document.querySelector('.active');
                index = pgItems.indexOf(activeClass);
                if(pgItems.length > 21) {
                    if(index > 9 && index < pgItems.length - 10) {
                        fTDots.classList.remove('d-none');
                        lTDots.classList.remove('d-none');
                        for(let i = 1; i < pgItems.length - 1; i++) {
                            pgItems[i].classList.add('d-none');
                        }
                        for (let i = index; i > index - 9; i--) {
                            if (i < 1) {
                                break;
                            }
                            pgItems[i].classList.remove('d-none')
                        }
                        for (let i = index; i < index + 9; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    } else if (index <= 9) {
                        fTDots.classList.add('d-none');
                        lTDots.classList.remove('d-none');
                        for (let i = 21; i < pgItems.length - 2; i++) {
                            pgItems[i].classList.add('d-none')
                        }
                        for (let i = 1; i < 21; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    } else {
                        lTDots.classList.add('d-none');
                        fTDots.classList.remove('d-none');
                        for (let i = 1; i < pgItems.length - 20; i++) {
                            pgItems[i].classList.add('d-none');
                        }
                        for (let i = pgItems.length - 22; i < pgItems.length - 1; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    }
                }
                setTimeout(() => {
                    let qEmp = $("#qEmployee").val();
                    let qProj = $("#qProject").val();
                    let qDept = $("#qDepartment").val();
                    let qPos = $("#qPosition").val();
                    let qTime = $("#qTime").val();
                    let qDay = $("#day").val();
                    let qMonth = $("#month").val();
                    let qYear = $("#year").val();

                    $.post('http://localhost:3000/api/fprints/by-page', {
                        qEmployee: qEmp,
                        qProject: qProj,
                        qDepartment: qDept,
                        qPosition: qPos,
                        qTime: qTime,
                        qDay: qDay,
                        qMonth: qMonth,
                        qYear: qYear,
                        offset: offset
                    }, (res) => {
                        let tbody = $("tbody");
                        let trs = "";
                        tbody.text("");
                        let fprints = res.fPrints.fprints;
                        console.log(fprints);
                        for (let i = 0; i < fprints.length; i++) {
                            const date = new Date(fprints[i].f_print_date);
                            let time = [];
                            if(fprints[i].f_print_time) {
                                time = fprints[i].f_print_time.split(':');
                                time = time[0] + ":" + time[1];
                            }
                            let createdAt = date.toLocaleDateString();
                            createdAt = createdAt.split('/');
                            let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                            trs +=
                                `
                    <tr>
                        <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                        <td>${fprints[i].projName}</td>
                        <td>${fprints[i].deptName}</td>
                        <td>${fprints[i].posName}</td>
                        <td>${time}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                        }
                        if(trs.length !== 0) {
                            tbody.html(trs);
                        } else {
                            tbody.text("No Data Found");
                        }
                        loading.classList.add('d-none');
                    });
                }, 1000);
            });
        });
    }

    const renderPage = () => {
        let qEmp = $("#qEmployee").val();
        let qProj = $("#qProject").val();
        let qDept = $("#qDepartment").val();
        let qPos = $("#qPosition").val();
        let qTime = $("#qTime").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();
        let offset = 0;

        console.log(qEmp);
        console.log(offset);

        $.post("http://localhost:3000/api/fprints/all", {
                qEmployee: qEmp,
                qProject: qProj,
                qDepartment: qDept,
                qPosition: qPos,
                qTime: qTime,
                qDay: qDay,
                qMonth: qMonth,
                qYear: qYear,
                offset: offset
            },
            (res) => {
                console.log(res)
                let fprints = res.fPrints.fprints;
                let count = res.fPrints.count[0].count;
                let html = '';
                count = Math.ceil(count / 15);

                for (let i = 1; i <= count; i++) {
                    if (i === 1) {
                        html += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
                        html += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                    } if (i > 21 && i < count) {
                        html += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    } else if (i !== 1 && i !== count) {
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                    if (i === count) {
                        if(count > 21) {
                            html += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                        }
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                }
                pgContatiner.innerHTML = html;
                console.log(fprints)
                let tbody = $("tbody");
                let trs = "";
                tbody.text("");
                for (let i = 0; i < fprints.length; i++) {
                    const date = new Date(fprints[i].f_print_date);
                    let time = fprints[i].f_print_time.split(':');
                    time = time[0] + ":" + time[1];
                    let createdAt = date.toLocaleDateString();
                    createdAt = createdAt.split('/');
                    let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                    trs +=
                        `
                    <tr>
                        <td>${fprints[i].name} ${fprints[i].surname} ${fprints[i].fname}</td>
                        <td>${fprints[i].projName}</td>
                        <td>${fprints[i].deptName}</td>
                        <td>${fprints[i].posName}</td>
                        <td>${time}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                }
                if(trs.length !== 0) {
                    tbody.html(trs);
                } else {
                    tbody.text("No Data Found");
                }
                loading.classList.add('d-none');
                pageFunctions();
            });
    }

    const exportToExcel = () => {
        let qEmployee = $("#qEmployee").val();
        let qProject = $("#qProject").val();
        let qDepartment = $("#qDepartment").val();
        let qPosition = $("#qPosition").val();
        let qTime = $("#qTime").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();

        const method = "post";
        let params = {
            qEmployee,
            qProject,
            qDepartment,
            qPosition,
            qTime,
            qDay,
            qMonth,
            qYear,
            limit: "all"
        }
        let form = document.createElement('form');
        form.setAttribute("method", method);
        form.setAttribute("action", "http://localhost:3000/api/fprints/export-excel");
     
        for (let key in params) {
           if (params.hasOwnProperty(key)) {
              const hiddenField = document.createElement("input");
              hiddenField.setAttribute('type', 'hidden');
              hiddenField.setAttribute('name', key);
              hiddenField.setAttribute('value', params[key]);
              form.appendChild(hiddenField);
           }
        }
        document.body.appendChild(form);
        form.submit();
     }

     const exportAllFPrint = document.querySelector("#exportAllFPrint");

     exportAllFPrint.addEventListener("click", () => {
        exportToExcel()
    });

    setTimeout(renderPage, 2500);

    qEmp.keyup(renderPage)
    qProj.keyup(renderPage)
    qDept.keyup(renderPage)
    qPos.keyup(renderPage)
    qTime.keyup(renderPage)
    qDay.change(renderPage)
    qMonth.change(renderPage)
    qYear.change(renderPage)

}
const renderNoFPrints = () => {
    const qEmp = $("#qEmployee");
    const qProj = $("#qProject");
    const qDept = $("#qDepartment");
    const qPos = $("#qPosition");
    const qTimeEnter = $("#qTimeEnter");
    const qTimeLeave = $("#qTimeLeave");
    const qDay = $("#day");
    const qMonth = $("#month");
    const qYear = $("#year");

    const pgContatiner = document.querySelector(".pagination-container");
    const loading = document.querySelector(".loading");

    const pageFunctions = () => {
        let pgItems = document.querySelectorAll('.pagination-item');
        let fTDots = document.querySelector('.fTDots');
        let lTDots = document.querySelector('.lTDots');
        pgItems = Array.from(pgItems);
        pgItems.forEach(item => {
            item.addEventListener("click", () => {
                loading.classList.remove('d-none');
                let offset = parseInt(item.value) - 1;
                let activeClass = document.querySelector('.active');
                let index = pgItems.indexOf(activeClass);
                pgItems[index].classList.remove('active');
                item.classList.add('active');
                activeClass = document.querySelector('.active');
                index = pgItems.indexOf(activeClass);
                if(pgItems.length > 21) {
                    if(index > 9 && index < pgItems.length - 10) {
                        fTDots.classList.remove('d-none');
                        lTDots.classList.remove('d-none');
                        for(let i = 1; i < pgItems.length - 1; i++) {
                            pgItems[i].classList.add('d-none');
                        }
                        for (let i = index; i > index - 9; i--) {
                            if (i < 1) {
                                break;
                            }
                            pgItems[i].classList.remove('d-none')
                        }
                        for (let i = index; i < index + 9; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    } else if (index <= 9) {
                        fTDots.classList.add('d-none');
                        lTDots.classList.remove('d-none');
                        for (let i = 21; i < pgItems.length - 2; i++) {
                            pgItems[i].classList.add('d-none')
                        }
                        for (let i = 1; i < 21; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    } else {
                        lTDots.classList.add('d-none');
                        fTDots.classList.remove('d-none');
                        for (let i = 1; i < pgItems.length - 20; i++) {
                            pgItems[i].classList.add('d-none');
                        }
                        for (let i = pgItems.length - 22; i < pgItems.length - 1; i++) {
                            pgItems[i].classList.remove('d-none');
                        }
                    }
                }
                setTimeout(() => {
                    let qEmp = $("#qEmployee").val();
                    let qProj = $("#qProject").val();
                    let qDept = $("#qDepartment").val();
                    let qPos = $("#qPosition").val();
                    let qTimeEnter = $("#qTimeEnter");
                    let qTimeLeave = $("#qTimeLeave");
                    let qDay = $("#day").val();
                    let qMonth = $("#month").val();
                    let qYear = $("#year").val();

                    $.post('http://localhost:3000/api/nofprints', {
                        qEmployee: qEmp,
                        qProject: qProj,
                        qDepartment: qDept,
                        qPosition: qPos,
                        qTimeEnter: qTimeEnter,
                        qTimeLeave: qTimeLeave,
                        qDay: qDay,
                        qMonth: qMonth,
                        qYear: qYear,
                        offset: offset
                    }, (res) => {
                        let tbody = $("tbody");
                        let trs = "";
                        tbody.text("");
                        let nfprints = res.result.nfprints;
                        console.log(nfprints);
                        for (let i = 0; i < nfprints.length; i++) {
                            const date = new Date(nfprints[i].createdAt);
                            let enterTime = [];
                            let leaveTime = [];
                            if(nfprints[i].enter_sign_time) {
                                enterTime = nfprints[i].enter_sign_time.split(':');
                                enterTime = enterTime[0] + ":" + enterTime[1];
                            }
                            if(nfprints[i].leave_sign_time) {
                                leaveTime = nfprints[i].leave_sign_time.split(':');
                                leaveTime = leaveTime[0] + ":" + leaveTime[1];
                            } else {
                                leaveTime = `<button class="btn btn-outline-warning btn-sm"><i class="bi bi-check-lg"></i></button>`
                            }
                            let createdAt = date.toLocaleDateString();
                            createdAt = createdAt.split('/');
                            let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                            trs +=
                                `
                    <tr>
                        <td>${nfprints[i].name} ${nfprints[i].surname} ${nfprints[i].fname}</td>
                        <td>${nfprints[i].projName}</td>
                        <td>${nfprints[i].deptName}</td>
                        <td>${nfprints[i].posName}</td>
                        <td>${enterTime}</td>
                        <td>${leaveTime}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                        }
                        if(trs.length !== 0) {
                            tbody.html(trs);
                        } else {
                            tbody.text("No Data Found");
                        }
                        loading.classList.add('d-none');
                    });
                }, 1000);
            });
        });
    }

    const renderPage = () => {
        let qEmp = $("#qEmployee").val();
        let qProj = $("#qProject").val();
        let qDept = $("#qDepartment").val();
        let qPos = $("#qPosition").val();
        let qTimeEnter = $("#qTimeEnter").val();
        let qTimeLeave = $("#qTimeLeave").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();
        let offset = 0;

        console.log(qEmp);
        console.log(offset);

        $.post("http://localhost:3000/api/nofprints", {
                qEmployee: qEmp,
                qProject: qProj,
                qDepartment: qDept,
                qPosition: qPos,
                qTimeEnter: qTimeEnter,
                qTimeLeave: qTimeLeave,
                qDay: qDay,
                qMonth: qMonth,
                qYear: qYear,
                offset: offset
            },
            (res) => {
                console.log(res)
                let nfprints = res.result.nfprints;
                let count = res.result.count[0].count;
                let html = '';
                count = Math.ceil(count / 15);

                for (let i = 1; i <= count; i++) {
                    if (i === 1) {
                        html += `<button class="pagination-item f-item btn btn-outline-dark btn-sm active" value="${i}">${i}</button>`
                        html += `<button class="d-none btn btn-outline-dark btn-sm fTDots disabled">...</button>`
                    } if (i > 21 && i < count) {
                        html += `
                    <button class="pagination-item d-none btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    } else if (i !== 1 && i !== count) {
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                    if (i === count) {
                        if(count > 21) {
                            html += `<button class="btn btn-outline-dark btn-sm lTDots disabled">...</button>`
                        }
                        html += `
                    <button class="pagination-item btn btn-outline-dark btn-sm" value="${i}">${i}</button>
                `
                    }
                }
                pgContatiner.innerHTML = html;
                console.log(nfprints)
                let tbody = $("tbody");
                let trs = "";
                tbody.text("");
                for (let i = 0; i < nfprints.length; i++) {
                    const date = new Date(nfprints[i].createdAt);
                    let enterTime = [];
                    if (nfprints[i].enter_sign_time) {
                        enterTime = nfprints[i].enter_sign_time.split(':')
                        enterTime = enterTime[0] + ":" + enterTime[1];
                    }
                    let leaveTime = [];
                    if(nfprints[i].leave_sign_time) {
                        leaveTime = nfprints[i].leave_sign_time.split(':');
                        leaveTime = leaveTime[0] + ":" + leaveTime[1];
                    } else {
                        leaveTime = `<button class="btn btn-outline-warning btn-sm"><i class="bi bi-check-lg"></i></button>`

                    }
                    let createdAt = date.toLocaleDateString();
                    createdAt = createdAt.split('/');
                    let updatedDate = `${createdAt[1]}.${createdAt[0]}.${createdAt[2]}`
                    trs +=
                        `
                    <tr>
                        <td>${nfprints[i].name} ${nfprints[i].surname} ${nfprints[i].fname}</td>
                        <td>${nfprints[i].projName}</td>
                        <td>${nfprints[i].deptName}</td>
                        <td>${nfprints[i].posName}</td>
                        <td>${enterTime}</td>
                        <td>${leaveTime}</td>
                        <td>${updatedDate}</td>
                        <td></td>
                    </tr>
                `
                }
                if(trs.length !== 0) {
                    tbody.html(trs);
                } else {
                    tbody.text("No Data Found");
                }
                loading.classList.add('d-none');
                pageFunctions();
            });
    }

    const exportToExcel = () => {
        let qEmp = $("#qEmployee").val();
        let qProj = $("#qProject").val();
        let qDept = $("#qDepartment").val();
        let qPos = $("#qPosition").val();
        let qTimeEnter = $("#qTimeEnter").val();
        let qTimeLeave = $("#qTimeLeave").val();
        let qDay = $("#day").val();
        let qMonth = $("#month").val();
        let qYear = $("#year").val();
        let offset = 0;

        const method = "post";
        let params = {
            qEmployee: qEmp,
                qProject: qProj,
                qDepartment: qDept,
                qPosition: qPos,
                qTimeEnter: qTimeEnter,
                qTimeLeave: qTimeLeave,
                qDay: qDay,
                qMonth: qMonth,
                qYear: qYear,
                limit: "all"
        }
        let form = document.createElement('form');
        form.setAttribute("method", method);
        form.setAttribute("action", "http://localhost:3000/api/nofprints/export-excel");
     
        for (let key in params) {
           if (params.hasOwnProperty(key)) {
              const hiddenField = document.createElement("input");
              hiddenField.setAttribute('type', 'hidden');
              hiddenField.setAttribute('name', key);
              hiddenField.setAttribute('value', params[key]);
              form.appendChild(hiddenField);
           }
        }
        document.body.appendChild(form);
        form.submit();
     }

     const exportAllFPrint = document.querySelector("#exportAllFPrint");

     exportAllFPrint.addEventListener("click", () => {
        exportToExcel()
    });

    setTimeout(renderPage, 2500);

    qEmp.keyup(renderPage)
    qProj.keyup(renderPage)
    qDept.keyup(renderPage)
    qPos.keyup(renderPage)
    qTimeEnter.keyup(renderPage)
    qTimeLeave.keyup(renderPage)
    qDay.change(renderPage)
    qMonth.change(renderPage)
    qYear.change(renderPage)

}
const renderInappropriateFPrints = () => {
    const tbody = document.querySelector("tbody");
    const loading = document.querySelector(".loading");

    const pageFunctions = () => {
        const fPrintEntranceBtnS = document.querySelectorAll(".fPrintEntrance");
        const fPrintExitBtnS = document.querySelectorAll(".fPrintExit");
        const addTimeModal = document.querySelector(".add-time-modal");
        const timeInputCancel = document.querySelector("#timeInputCancel");
        const timeInputSubmit = document.querySelector('#timeInputSubmit');
        const timeInput = document.querySelector("#timeInput");
        fPrintEntranceBtnS.forEach(item => {
            item.addEventListener("click", () => {
                addTimeModal.classList.remove('d-none');
                addTimeModal.classList.add('d-flex');
                timeInputSubmit.value = item.value;

                timeInputSubmit.addEventListener("click", () => {
                    const btnValue = timeInputSubmit.value;
                    const inputValue = timeInput.value;
                    $.get(`http://localhost:3000/api/fprints/update/forgotten-fprints?btnValue=${btnValue}&entrance=true&time=${inputValue}`);
                    addTimeModal.classList.remove('d-flex');
                    addTimeModal.classList.add('d-none');
                    loading.classList.add('d-flex');
                    loading.classList.remove('d-none');
                    setTimeout(renderPage, 2000);
                });
            });
        });
        fPrintExitBtnS.forEach(item => {
            item.addEventListener("click", () => {
                addTimeModal.classList.remove('d-none');
                addTimeModal.classList.add('d-flex');
                timeInputSubmit.value = item.value;

                timeInputSubmit.addEventListener("click", () => {
                    const btnValue = timeInputSubmit.value;
                    const inputValue = timeInput.value;
                    $.get(`http://localhost:3000/api/fprints/update/forgotten-fprints?btnValue=${btnValue}&exit=true&time=${inputValue}`);
                    addTimeModal.classList.remove('d-flex');
                    addTimeModal.classList.add('d-none');
                    loading.classList.add('d-flex');
                    loading.classList.remove('d-none');
                    setTimeout(renderPage, 2000);
                });
            });
        });
        timeInputCancel.addEventListener('click', () => {
            addTimeModal.classList.remove('d-flex');
            addTimeModal.classList.add('d-none');
        });

    }

    function renderPage() {
        $.get("http://localhost:3000/api/fprints/inappropriate-fprints", (res) => {
            const result = res.result;
            let html = "";
            result.forEach(item => {
                if(item.f_print_time_entrance === null) {
                    item.f_print_time_entrance = `<button class="btn btn-outline-success fPrintEntrance" value="${item.id}">Vaxt əlavə et</button>`;
                } else if (item.f_print_time_exit === null) {
                    item.f_print_time_exit = `<button class="btn btn-outline-success fPrintExit" value="${item.id}">Vaxt əlavə et</button>`;
                }
                html += `
                <tr> 
                    <td>${item.first_name} ${item.last_name} ${item.father_name}</td>
                    <td>${item.f_print_date}</td>
                    <td>${item.f_print_time_entrance}</td>
                    <td>${item.f_print_time_exit}</td>
                </tr>
            `
            });
            tbody.innerHTML = html;
            loading.classList.remove("d-flex");
            loading.classList.add("d-none");
            pageFunctions();
        });
    }


    setTimeout(renderPage, 1500);
}

renderAllFPrint();

fPrintType.addEventListener("change", () => {
    if(parseInt(fPrintType.value) === 0) {
        thead.innerHTML = thForFPrintsAndAllFPrints;
        inputs.innerHTML = inputThForFPrintsAndAllFPrints;
        tbody.innerHTML = tr;
        loading.classList.remove("d-none");
        pgContainer.innerHTML = "";
        renderAllFPrint();
    } else if (parseInt(fPrintType.value) === 1) {
        thead.innerHTML = thForFPrintsAndAllFPrints;
        inputs.innerHTML = inputThForFPrintsAndAllFPrints;
        tbody.innerHTML = tr;
        loading.classList.remove("d-none");
        pgContainer.innerHTML = "";
        renderFPrint();
    } else if (parseInt(fPrintType.value) === 2) {
        tbody.innerHTML = trForNoFPrints;
        thead.innerHTML = thForNoFPrints;
        inputs.innerHTML = inputThForNoFPrints;
        loading.classList.remove("d-none");
        pgContainer.innerHTML = "";
        renderNoFPrints();
    } else if(parseInt(fPrintType.value) === 3) {
        tbody.innerHTML = trForInappropriateFPrints;
        thead.innerHTML = thForInappropriateFPrints;
        inputs.innerHTML = inputThForInappropriateFPrints;
        loading.classList.remove("d-none");
        pgContainer.innerHTML = "";
        renderInappropriateFPrints();
    }
});